import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  CategoryItem,
  BusinessIdeaItem,
  MarketplaceProductItem,
  INITIAL_CATEGORIES,
  INITIAL_BUSINESS_IDEAS,
  INITIAL_PRODUCTS,
} from '../data/seedData';

export interface AdminAuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  target: string;
  previousValue: string;
  newValue: string;
  reason: string;
  createdAt: string;
  timestampMs?: number;
}

export async function recordAdminAuditLog(params: {
  adminId: string;
  adminEmail: string;
  action: string;
  target: string;
  previousValue: string;
  newValue: string;
  reason: string;
}): Promise<AdminAuditLogEntry> {
  const logId = 'audit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const entry: AdminAuditLogEntry = {
    id: logId,
    adminId: params.adminId,
    adminEmail: params.adminEmail,
    action: params.action.slice(0, 120),
    target: params.target.slice(0, 160),
    previousValue: params.previousValue.slice(0, 500),
    newValue: params.newValue.slice(0, 500),
    reason: (params.reason || 'অ্যাডমিন অ্যাকশন').slice(0, 400),
    createdAt: new Date().toLocaleString('bn-BD'),
    timestampMs: Date.now(),
  };

  await setDoc(doc(db, 'auditLogs', logId), {
    id: entry.id,
    adminId: entry.adminId,
    adminEmail: entry.adminEmail,
    action: entry.action,
    target: entry.target,
    previousValue: entry.previousValue,
    newValue: entry.newValue,
    reason: entry.reason,
    createdAt: serverTimestamp(),
  });

  return entry;
}

/**
 * Atomic Firestore Transaction for Admin Wallet & Points Adjustment
 */
export async function adminAdjustWalletAtomic(params: {
  adminId: string;
  adminEmail: string;
  targetUid: string;
  amountDelta: number;
  pointsDelta: number;
  reason: string;
}): Promise<{
  newBalance: number;
  newPoints: number;
  auditEntry: AdminAuditLogEntry;
}> {
  if (!params.reason.trim() || params.reason.trim().length < 3) {
    throw new Error('ব্যালেন্স বা পয়েন্ট পরিবর্তনের জন্য কমপক্ষে ৩ অক্ষরের কারণ (Reason) উল্লেখ করা আবশ্যক।');
  }

  const userRef = doc(db, 'users', params.targetUid);
  const txId = 'tx_' + Date.now();
  const txRef = doc(db, 'transactions', txId);
  const logId = 'audit_' + Date.now();
  const logRef = doc(db, 'auditLogs', logId);

  let prevBal = 0;
  let prevPts = 0;
  let nextBal = 0;
  let nextPts = 0;

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) {
      throw new Error('উক্ত ইউজার প্রোফাইল Firestore ডাটাবেসে পাওয়া যায়নি।');
    }

    const userData = userSnap.data();
    prevBal = Number(userData.walletBalance) || 0;
    prevPts = Number(userData.points) || 0;
    nextBal = Math.max(0, prevBal + params.amountDelta);
    nextPts = Math.max(0, prevPts + params.pointsDelta);

    transaction.update(userRef, {
      walletBalance: nextBal,
      points: nextPts,
      updatedAt: serverTimestamp(),
    });

    transaction.set(txRef, {
      id: txId,
      userId: params.targetUid,
      type: 'adjustment',
      amountBdt: params.amountDelta,
      pointsDelta: params.pointsDelta,
      reason: params.reason.trim().slice(0, 300),
      adminId: params.adminId,
      createdAt: serverTimestamp(),
    });

    transaction.set(logRef, {
      id: logId,
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action: 'WALLET_AND_POINTS_ADJUSTMENT',
      target: `users/${params.targetUid}`,
      previousValue: `Balance: ৳${prevBal}, Points: ${prevPts}`,
      newValue: `Balance: ৳${nextBal}, Points: ${nextPts}`,
      reason: params.reason.trim().slice(0, 400),
      createdAt: serverTimestamp(),
    });
  });

  return {
    newBalance: nextBal,
    newPoints: nextPts,
    auditEntry: {
      id: logId,
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action: 'WALLET_AND_POINTS_ADJUSTMENT',
      target: `users/${params.targetUid}`,
      previousValue: `Balance: ৳${prevBal}, Points: ${prevPts}`,
      newValue: `Balance: ৳${nextBal}, Points: ${nextPts}`,
      reason: params.reason.trim(),
      createdAt: new Date().toLocaleString('bn-BD'),
      timestampMs: Date.now(),
    },
  };
}

/**
 * Atomic Firestore Transaction for Withdrawal Approval / Rejection
 * Prevents duplicate approval or balance manipulation.
 */
export async function adminProcessWithdrawalAtomic(params: {
  adminId: string;
  adminEmail: string;
  withdrawalId: string;
  decision: 'approved' | 'rejected';
  rejectionReason?: string;
}): Promise<{ auditEntry: AdminAuditLogEntry }> {
  if (
    params.decision === 'rejected' &&
    (!params.rejectionReason || params.rejectionReason.trim().length < 3)
  ) {
    throw new Error('উইথড্রয়াল বাতিল (Reject) করার জন্য কারণ উল্লেখ করা বাধ্যতামূলক।');
  }

  const withdrawalRef = doc(db, 'withdrawals', params.withdrawalId);
  const logId = 'audit_' + Date.now();
  const logRef = doc(db, 'auditLogs', logId);
  let targetUserId = '';
  let amountBdt = 0;

  await runTransaction(db, async (transaction) => {
    const wSnap = await transaction.get(withdrawalRef);
    if (!wSnap.exists()) {
      throw new Error('উইথড্রয়াল রিকোয়েস্টটি Firestore-এ পাওয়া যায়নি।');
    }

    const wData = wSnap.data();
    if (wData.status !== 'pending') {
      throw new Error(
        `এই রিকোয়েস্টটি ইতিমধ্যে "${wData.status}" অবস্থায় রয়েছে। পুনরায় পরিবর্তন করা যাবে না।`
      );
    }

    targetUserId = wData.userId;
    amountBdt = Number(wData.amountBdt) || 0;
    const userRef = doc(db, 'users', targetUserId);
    const userSnap = await transaction.get(userRef);

    if (params.decision === 'approved') {
      if (userSnap.exists()) {
        const curBal = Number(userSnap.data().walletBalance) || 0;
        if (curBal < amountBdt) {
          throw new Error(
            `ইউজারের ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই (বর্তমান ব্যালেন্স: ৳${curBal}, রিকোয়েস্ট: ৳${amountBdt})।`
          );
        }
        transaction.update(userRef, {
          walletBalance: curBal - amountBdt,
          updatedAt: serverTimestamp(),
        });
      }

      transaction.update(withdrawalRef, {
        status: 'approved',
        updatedAt: serverTimestamp(),
      });

      const txId = 'tx_w_' + Date.now();
      transaction.set(doc(db, 'transactions', txId), {
        id: txId,
        userId: targetUserId,
        type: 'withdrawal',
        amountBdt: -amountBdt,
        pointsDelta: 0,
        reason: `উইথড্রয়াল অনুমোদিত (${wData.method} - ${wData.accountNumber})`,
        adminId: params.adminId,
        createdAt: serverTimestamp(),
      });
    } else {
      transaction.update(withdrawalRef, {
        status: 'rejected',
        rejectionReason: params.rejectionReason!.trim().slice(0, 300),
        updatedAt: serverTimestamp(),
      });
    }

    transaction.set(logRef, {
      id: logId,
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action:
        params.decision === 'approved'
          ? 'WITHDRAWAL_APPROVED'
          : 'WITHDRAWAL_REJECTED',
      target: `withdrawals/${params.withdrawalId}`,
      previousValue: `status: pending (৳${amountBdt})`,
      newValue: `status: ${params.decision}`,
      reason:
        params.decision === 'approved'
          ? 'অ্যাডমিন কর্তৃক পেমেন্ট যাচাই ও অনুমোদন'
          : params.rejectionReason!.trim().slice(0, 400),
      createdAt: serverTimestamp(),
    });
  });

  return {
    auditEntry: {
      id: logId,
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action:
        params.decision === 'approved'
          ? 'WITHDRAWAL_APPROVED'
          : 'WITHDRAWAL_REJECTED',
      target: `withdrawals/${params.withdrawalId}`,
      previousValue: `status: pending (৳${amountBdt})`,
      newValue: `status: ${params.decision}`,
      reason:
        params.decision === 'approved'
          ? 'অ্যাডমিন কর্তৃক পেমেন্ট যাচাই ও অনুমোদন'
          : params.rejectionReason!.trim(),
      createdAt: new Date().toLocaleString('bn-BD'),
      timestampMs: Date.now(),
    },
  };
}

/**
 * Atomic Firestore Transaction for ৳299 Premium Membership Verification
 * Also credits referrer (+৳50 & +30 points) if user was referred!
 */
export async function adminVerifyMembershipAtomic(params: {
  adminId: string;
  adminEmail: string;
  membershipId: string;
  decision: 'verified' | 'failed';
  reason: string;
}): Promise<{ auditEntry: AdminAuditLogEntry }> {
  const memRef = doc(db, 'memberships', params.membershipId);
  const logId = 'audit_' + Date.now();
  const logRef = doc(db, 'auditLogs', logId);

  let targetUserId = '';
  let trxRef = '';

  await runTransaction(db, async (transaction) => {
    const mSnap = await transaction.get(memRef);
    if (!mSnap.exists()) {
      throw new Error('মেম্বারশিপ পেমেন্ট রেকর্ডটি পাওয়া যায়নি।');
    }
    const mData = mSnap.data();
    if (mData.status !== 'pending' && mData.status !== 'initiated') {
      throw new Error(
        `এই পেমেন্টটি ইতিমধ্যে "${mData.status}" হিসেবে প্রক্রিয়াকৃত।`
      );
    }

    targetUserId = mData.userId;
    trxRef = mData.transactionReference || '';
    const userRef = doc(db, 'users', targetUserId);
    const userSnap = await transaction.get(userRef);

    transaction.update(memRef, {
      status: params.decision,
      updatedAt: serverTimestamp(),
    });

    if (params.decision === 'verified' && userSnap.exists()) {
      const uData = userSnap.data();
      const curPoints = Number(uData.points) || 0;
      transaction.update(userRef, {
        membershipTier: 'premium',
        points: curPoints + 50,
        updatedAt: serverTimestamp(),
      });

      const txId = 'tx_mem_' + Date.now();
      transaction.set(doc(db, 'transactions', txId), {
        id: txId,
        userId: targetUserId,
        type: 'membership',
        amountBdt: 299,
        pointsDelta: 50,
        reason: `৳২৯৯ প্রিমিয়াম মেম্বারশিপ ভেরিফায়েড (TrxID: ${trxRef})`,
        adminId: params.adminId,
        createdAt: serverTimestamp(),
      });
    }

    transaction.set(logRef, {
      id: logId,
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action:
        params.decision === 'verified'
          ? 'MEMBERSHIP_VERIFIED'
          : 'MEMBERSHIP_REJECTED',
      target: `memberships/${params.membershipId}`,
      previousValue: 'status: pending',
      newValue: `status: ${params.decision} (TrxID: ${trxRef})`,
      reason: (params.reason || 'পেমেন্ট যাচাই').slice(0, 400),
      createdAt: serverTimestamp(),
    });
  });

  // If verified, also check if the user had a referrer code and reward the referrer
  if (params.decision === 'verified' && targetUserId) {
    try {
      const userSnap = await getDocs(
        query(collection(db, 'users'), where('uid', '==', targetUserId))
      );
      if (!userSnap.empty) {
        const referredByCode = userSnap.docs[0].data().referredBy;
        if (referredByCode && typeof referredByCode === 'string') {
          const refSnap = await getDocs(
            query(
              collection(db, 'users'),
              where('referralCode', '==', referredByCode.trim())
            )
          );
          if (!refSnap.empty) {
            const referrerDoc = refSnap.docs[0];
            const referrerData = referrerDoc.data();
            if (referrerData.uid !== targetUserId) {
              const newBal = (Number(referrerData.walletBalance) || 0) + 50;
              const newPts = (Number(referrerData.points) || 0) + 30;
              await updateDoc(doc(db, 'users', referrerData.uid), {
                walletBalance: newBal,
                points: newPts,
                updatedAt: serverTimestamp(),
              });
              const refTxId = 'tx_ref_' + Date.now();
              await setDoc(doc(db, 'transactions', refTxId), {
                id: refTxId,
                userId: referrerData.uid,
                type: 'referral',
                amountBdt: 50,
                pointsDelta: 30,
                reason: `রেফারেল প্রিমিয়াম বোনাস (${referredByCode})`,
                adminId: params.adminId,
                createdAt: serverTimestamp(),
              });
            }
          }
        }
      }
    } catch {
      // Non-fatal if referrer lookup fails
    }
  }

  return {
    auditEntry: {
      id: logId,
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action:
        params.decision === 'verified'
          ? 'MEMBERSHIP_VERIFIED'
          : 'MEMBERSHIP_REJECTED',
      target: `memberships/${params.membershipId}`,
      previousValue: 'status: pending',
      newValue: `status: ${params.decision} (TrxID: ${trxRef})`,
      reason: params.reason || 'পেমেন্ট যাচাই',
      createdAt: new Date().toLocaleString('bn-BD'),
      timestampMs: Date.now(),
    },
  };
}

/**
 * Syncs initial seed Categories, Business Ideas, and Marketplace Products into Cloud Firestore
 * so that all Admin CRUD operations persist directly in Firestore.
 */
export async function syncSeedContentToFirestore(): Promise<{
  categoriesSeeded: number;
  ideasSeeded: number;
  productsSeeded: number;
}> {
  let categoriesSeeded = 0;
  let ideasSeeded = 0;
  let productsSeeded = 0;

  for (const cat of INITIAL_CATEGORIES) {
    await setDoc(doc(db, 'categories', cat.id), {
      ...cat,
      createdAt: serverTimestamp(),
    });
    categoriesSeeded++;
  }

  for (const idea of INITIAL_BUSINESS_IDEAS) {
    await setDoc(doc(db, 'businessIdeas', idea.id), {
      ...idea,
      published: true,
      createdAt: serverTimestamp(),
    });
    ideasSeeded++;
  }

  for (const prod of INITIAL_PRODUCTS) {
    await setDoc(doc(db, 'products', prod.id), {
      ...prod,
      createdAt: serverTimestamp(),
    });
    productsSeeded++;
  }

  return { categoriesSeeded, ideasSeeded, productsSeeded };
}
