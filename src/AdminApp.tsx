import React, { useState, useEffect } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {
  db,
  initAuth,
  logoutFirebase,
  verifyAndSyncUserProfile,
} from './firebase';
import {
  INITIAL_CATEGORIES,
  INITIAL_BUSINESS_IDEAS,
  INITIAL_PRODUCTS,
  CategoryItem,
  BusinessIdeaItem,
  MarketplaceProductItem,
} from './data/seedData';
import {
  AuthViews,
  AuthSessionUser,
  BrandLogo,
} from './components/AuthViews';
import {
  AdminPanelView,
  AdminUserRecord,
  AdminOrderRecord,
  AdminMembershipRecord,
  WithdrawalRecord,
  WalletAuditRecord,
  AdminAuditLogRecord,
  NoticeRecord,
} from './components/AdminPanelView';

interface AdminAppProps {
  /** Only provided in web preview when verified Super Admin switches between User App & Admin App */
  onExitToUserPreview?: () => void;
}

export default function AdminApp({ onExitToUserPreview }: AdminAppProps) {
  const [authInitializing, setAuthInitializing] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(null);
  const [unauthorizedBlockedEmail, setUnauthorizedBlockedEmail] = useState<
    string | null
  >(null);

  // Firestore-backed Admin Collections State
  const [categories, setCategories] =
    useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [ideas, setIdeas] = useState<BusinessIdeaItem[]>(
    INITIAL_BUSINESS_IDEAS
  );
  const [products, setProducts] =
    useState<MarketplaceProductItem[]>(INITIAL_PRODUCTS);
  const [notices, setNotices] = useState<NoticeRecord[]>([
    {
      id: 'not-1',
      title: 'নতুন ৩০টি ক্যাটাগরি ও ৭টি বিজনেস ক্যালকুলেটর যুক্ত হয়েছে!',
      message:
        'আপনার পুঁজি অনুযায়ী সঠিক ব্যবসা খুঁজে পেতে আমাদের নতুন লাভ ক্যালকুলেটর ও এআই বিজনেস কনসালট্যান্ট ব্যবহার করুন।',
      targetAudience: 'all',
      published: true,
      createdAt: 'আজ',
    },
    {
      id: 'not-2',
      title: '৳২৯৯ প্রিমিয়াম মেম্বারশিপে ৫০ বোনাস পয়েন্ট ও রেফারেল ক্যাশব্যাক!',
      message:
        'বন্ধুকে রেফার করে প্রিমিয়াম মেম্বারশিপ সক্রিয় করলেই পাচ্ছেন নগদ ৳৫০ ওয়ালেট বোনাস।',
      targetAudience: 'all',
      published: true,
      createdAt: 'গতকাল',
    },
  ]);

  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [adminOrders, setAdminOrders] = useState<AdminOrderRecord[]>([]);
  const [adminWithdrawals, setAdminWithdrawals] = useState<WithdrawalRecord[]>(
    []
  );
  const [adminMemberships, setAdminMemberships] = useState<
    AdminMembershipRecord[]
  >([]);
  const [auditLogs, setAuditLogs] = useState<WalletAuditRecord[]>([]);
  const [adminSecurityLogs, setAdminSecurityLogs] = useState<
    AdminAuditLogRecord[]
  >([]);
  const [adminInvestments, setAdminInvestments] = useState<
    Array<{
      id: string;
      userId: string;
      userName: string;
      userPhone: string;
      projectId: string;
      projectTitle: string;
      categoryName: string;
      amountBdt: number;
      expectedMonthlyProfitBdt: number;
      profitSharePercent: string;
      durationMonths: number;
      paymentMethod: string;
      transactionId: string;
      status: 'pending' | 'active' | 'completed' | 'rejected';
      totalProfitPaidBdt: number;
    }>
  >([]);

  const writeAdminAuditLog = async (
    action: string,
    targetId: string,
    reason: string,
    previousValue = '-',
    newValue = '-'
  ) => {
    if (!currentUser) return;
    const logId =
      'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    const newEntry: AdminAuditLogRecord = {
      id: logId,
      adminId: currentUser.uid,
      adminEmail: currentUser.email,
      action,
      target: targetId,
      targetId,
      previousValue,
      newValue,
      reason,
      createdAt: new Date().toLocaleString('bn-BD'),
    };
    setAdminSecurityLogs((prev) => [newEntry, ...prev]);
    try {
      await setDoc(doc(db, 'auditLogs', logId), {
        id: logId,
        adminId: currentUser.uid,
        adminEmail: currentUser.email,
        action,
        target: targetId,
        previousValue,
        newValue,
        reason,
        createdAt: serverTimestamp(),
      });
    } catch {}
  };

  // 1. Persistent Firebase Auth & Strict Admin Role Verification
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setAuthInitializing(false);
    }, 1500);
    const unsubscribe = initAuth(
      async (fbUser) => {
        clearTimeout(safetyTimer);
        try {
          const profile = await verifyAndSyncUserProfile(fbUser);
          if (profile.status === 'banned' || !profile.isAuthorizedAdmin) {
            setUnauthorizedBlockedEmail(profile.email || fbUser.email || 'User');
            try {
              await logoutFirebase();
            } catch {}
            setCurrentUser(null);
            return;
          }
          setUnauthorizedBlockedEmail(null);
          setCurrentUser(profile);
        } catch (err) {
          console.error('Error verifying admin profile:', err);
          setCurrentUser(null);
        } finally {
          setAuthInitializing(false);
        }
      },
      () => {
        clearTimeout(safetyTimer);
        setCurrentUser(null);
        setAuthInitializing(false);
      }
    );
    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  // 2. Load All Real Firestore Admin Collections
  useEffect(() => {
    if (!currentUser || !currentUser.isAuthorizedAdmin) return;

    const loadAdminData = async () => {
      // Categories (merged with seed categories and photos, including 3 investment categories)
      try {
        const catSnap = await getDocs(collection(db, 'categories'));
        if (!catSnap.empty) {
          const loadedCats = catSnap.docs.map(
            (d) => d.data() as CategoryItem
          );
          const mergedCats: CategoryItem[] = loadedCats.map((cat) => {
            const seedMatch = INITIAL_CATEGORIES.find(
              (sc) => sc.id === cat.id || sc.nameBn === cat.nameBn
            );
            return {
              ...seedMatch,
              ...cat,
              imageUrl: cat.imageUrl || seedMatch?.imageUrl || '',
              fallbackImageUrl:
                cat.fallbackImageUrl || seedMatch?.fallbackImageUrl || '',
              expectedRoi: cat.expectedRoi || seedMatch?.expectedRoi,
              minInvestBdt: cat.minInvestBdt || seedMatch?.minInvestBdt,
              shortDesc: cat.shortDesc || seedMatch?.shortDesc,
            };
          });
          for (const seedCat of INITIAL_CATEGORIES) {
            if (
              !mergedCats.some(
                (c) => c.id === seedCat.id || c.nameBn === seedCat.nameBn
              )
            ) {
              mergedCats.push(seedCat);
              try {
                await setDoc(doc(db, 'categories', seedCat.id), {
                  ...seedCat,
                  createdAt: serverTimestamp(),
                });
              } catch {}
            }
          }
          setCategories(mergedCats.sort((a, b) => a.order - b.order));
        }
      } catch {}

      // Business Ideas (merged with seed ideas including 3 investment categories)
      try {
        const ideaSnap = await getDocs(
          query(
            collection(db, 'businessIdeas'),
            where('minInvestmentBdt', '>=', 0)
          )
        );
        if (!ideaSnap.empty) {
          const loadedIdeas = ideaSnap.docs.map((d) => d.data() as BusinessIdeaItem);
          const mergedIdeas = [...loadedIdeas];
          for (const seedIdea of INITIAL_BUSINESS_IDEAS) {
            if (!mergedIdeas.some((i) => i.id === seedIdea.id)) {
              mergedIdeas.push(seedIdea);
              try {
                await setDoc(doc(db, 'businessIdeas', seedIdea.id), {
                  ...seedIdea,
                  createdAt: serverTimestamp(),
                });
              } catch {}
            }
          }
          setIdeas(mergedIdeas);
        }
      } catch {}

      // Marketplace Products
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        if (!prodSnap.empty) {
          const loadedProds = prodSnap.docs.map(
            (d) => d.data() as MarketplaceProductItem
          );
          const merged = [...loadedProds];
          INITIAL_PRODUCTS.forEach((seedProd) => {
            if (!merged.some((p) => p.id === seedProd.id)) {
              merged.push(seedProd);
            }
          });
          setProducts(merged);
        }
      } catch {}

      // Notices
      try {
        const nSnap = await getDocs(collection(db, 'notices'));
        if (!nSnap.empty) {
          setNotices(
            nSnap.docs.map((d) => {
              const data = d.data();
              return {
                id: data.id,
                title: data.title,
                message: data.message,
                targetAudience: data.targetAudience || 'all',
                published: Boolean(data.published),
                createdAt: 'অফিসিয়াল নোটিশ',
              };
            })
          );
        }
      } catch {}

      // All Users
      try {
        const uSnap = await getDocs(collection(db, 'users'));
        const rawDocs = uSnap.docs.map((d) => d.data());
        const referralCountByCode: Record<string, number> = {};
        rawDocs.forEach((data) => {
          const refBy = (data.referredBy || '').trim().toUpperCase();
          if (refBy) {
            referralCountByCode[refBy] =
              (referralCountByCode[refBy] || 0) + 1;
          }
        });

        const allU: AdminUserRecord[] = rawDocs.map((data) => {
          let joinedLabel = 'সক্রিয় সদস্য';
          if (
            data.createdAt &&
            typeof data.createdAt.toDate === 'function'
          ) {
            try {
              joinedLabel = data.createdAt
                .toDate()
                .toLocaleDateString('bn-BD');
            } catch {}
          }
          const myCode = (data.referralCode || 'APB-USER')
            .trim()
            .toUpperCase();
          const computedRefCount =
            Number(data.referralCount) || referralCountByCode[myCode] || 0;

          return {
            uid: data.uid,
            fullName: data.fullName || 'উদ্যোক্তা সদস্য',
            email: data.email || '',
            phone: data.phone || '01700000000',
            role: data.role || 'user',
            status: data.status === 'banned' ? 'banned' : 'active',
            membershipTier:
              data.membershipTier === 'premium' ? 'premium' : 'free',
            walletBalance: Number(data.walletBalance) || 0,
            points: Number(data.points) || 0,
            referralCode: data.referralCode || 'APB-USER',
            referredBy: data.referredBy || '',
            referralCount: computedRefCount,
            joinedAt: joinedLabel,
            createdAtLabel: joinedLabel,
            registeredAt: joinedLabel,
          };
        });
        if (allU.length > 0) {
          setAdminUsers(allU);
        }
      } catch {}

      // All Orders
      try {
        const allOrdSnap = await getDocs(collection(db, 'orders'));
        setAdminOrders(
          allOrdSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              productId: data.productId,
              productTitle: data.productTitle,
              buyerId: data.buyerId,
              buyerName: data.buyerName,
              buyerPhone: data.buyerPhone,
              deliveryAddress: data.deliveryAddress,
              quantity: Number(data.quantity) || 1,
              totalPriceBdt: Number(data.totalPriceBdt) || 0,
              status: data.status || 'placed',
              createdAt: 'Firestore সংরক্ষিত',
            };
          })
        );
      } catch {}

      // All Withdrawals
      try {
        const allWSnap = await getDocs(collection(db, 'withdrawals'));
        setAdminWithdrawals(
          allWSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              userId: data.userId,
              userName: data.userName,
              amountBdt: Number(data.amountBdt) || 0,
              method: data.method || 'bKash',
              accountNumber: data.accountNumber || '',
              status: data.status || 'pending',
              rejectionReason: data.rejectionReason,
              createdAt: 'Firestore সংরক্ষিত',
            };
          })
        );
      } catch {}

      // All Memberships
      try {
        const allMSnap = await getDocs(collection(db, 'memberships'));
        setAdminMemberships(
          allMSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              userId: data.userId,
              userName: data.userName,
              amountBdt: Number(data.amountBdt) || 299,
              paymentMethod: data.paymentMethod || 'bKash',
              transactionReference: data.transactionReference || '',
              status: data.status || 'pending',
              createdAt: 'Firestore সংরক্ষিত',
            };
          })
        );
      } catch {}

      // All Investments & Buy-and-Earn Package Orders (Initial fetch + Real-time listener below)
      try {
        const invSnap = await getDocs(collection(db, 'investments'));
        setAdminInvestments(
          invSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              userId: data.userId || '',
              userName: data.userName || 'উদ্যোক্তা সদস্য',
              userPhone: data.userPhone || '01700000000',
              projectId: data.projectId || '',
              projectTitle: data.projectTitle || 'ইনভেস্টমেন্ট প্রজেক্ট',
              categoryName: data.categoryName || 'ইনভেস্টমেন্ট',
              amountBdt: Number(data.amountBdt) || 0,
              expectedMonthlyProfitBdt:
                Number(data.expectedMonthlyProfitBdt) || 0,
              profitSharePercent: data.profitSharePercent || '১৫%',
              durationMonths: Number(data.durationMonths) || 1,
              paymentMethod: data.paymentMethod || 'bKash',
              transactionId: data.transactionId || '',
              status: data.status || 'pending',
              totalProfitPaidBdt: Number(data.totalProfitPaidBdt) || 0,
            };
          })
        );
      } catch {}

      // All Wallet Transactions
      try {
        const allTxSnap = await getDocs(collection(db, 'transactions'));
        setAuditLogs(
          allTxSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              userId: data.userId,
              userName: data.userName || 'উদ্যোক্তা',
              type: data.type || 'adjustment',
              amountBdt: Number(data.amountBdt) || 0,
              pointsDelta: Number(data.pointsDelta) || 0,
              reason: data.reason || '',
              adminId: data.adminId,
              createdAt: 'Firestore সংরক্ষিত',
            };
          })
        );
      } catch {}

      // All Immutable Security Audit Logs
      try {
        const allLogSnap = await getDocs(collection(db, 'auditLogs'));
        setAdminSecurityLogs(
          allLogSnap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              adminId: data.adminId,
              adminEmail: data.adminEmail,
              action: data.action,
              target: data.target || data.targetId || '',
              targetId: data.targetId || data.target || '',
              previousValue: data.previousValue || '-',
              newValue: data.newValue || '-',
              reason: data.reason || '',
              createdAt: 'Firestore সংরক্ষিত',
            };
          })
        );
      } catch {}
    };

    loadAdminData();

    const unsubInv = onSnapshot(
      collection(db, 'investments'),
      (snap) => {
        setAdminInvestments(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              userId: data.userId || '',
              userName: data.userName || 'উদ্যোক্তা সদস্য',
              userPhone: data.userPhone || '01700000000',
              projectId: data.projectId || '',
              projectTitle: data.projectTitle || 'ইনভেস্টমেন্ট প্রজেক্ট',
              categoryName: data.categoryName || 'ইনভেস্টমেন্ট',
              amountBdt: Number(data.amountBdt) || 0,
              expectedMonthlyProfitBdt:
                Number(data.expectedMonthlyProfitBdt) || 0,
              profitSharePercent: data.profitSharePercent || '১৫%',
              durationMonths: Number(data.durationMonths) || 1,
              paymentMethod: data.paymentMethod || 'bKash',
              transactionId: data.transactionId || '',
              status: data.status || 'pending',
              totalProfitPaidBdt: Number(data.totalProfitPaidBdt) || 0,
            };
          })
        );
      },
      () => {}
    );

    const unsubMem = onSnapshot(
      collection(db, 'memberships'),
      (snap) => {
        setAdminMemberships(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id,
              userId: data.userId,
              userName: data.userName,
              amountBdt: Number(data.amountBdt) || 299,
              paymentMethod: data.paymentMethod || 'bKash',
              transactionReference: data.transactionReference || '',
              status: data.status || 'pending',
              createdAt: 'Firestore সংরক্ষিত',
            };
          })
        );
      },
      () => {}
    );

    return () => {
      unsubInv();
      unsubMem();
    };
  }, [currentUser]);

  const handleAdminLogout = async () => {
    try {
      localStorage.removeItem('alpo_admin_session_active');
    } catch {}
    await logoutFirebase();
    setCurrentUser(null);
  };

  if (authInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#042F24] via-[#064E3B] to-[#022C22] text-white flex flex-col items-center justify-center p-6">
        <BrandLogo size="lg" />
        <h2 className="text-xl font-bold mt-4">অল্প পুঁজির ব্যবসা Admin</h2>
        <div className="flex items-center gap-2 text-xs text-[#FDE68A] mt-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>অ্যাডমিন সিকিউরিটি সেশন যাচাই করা হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // Standalone Admin Login (Requires Firebase Auth + Firestore Admin Role verification)
  if (!currentUser || !currentUser.isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex flex-col">
        {unauthorizedBlockedEmail && (
          <div className="bg-red-900 text-white px-4 py-3 text-xs font-bold flex items-center justify-center gap-2 text-center">
            <Lock className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              প্রবেশাধিকার সংরক্ষিত: ({unauthorizedBlockedEmail}) সাধারণ ইউজার
              অ্যাকাউন্ট দিয়ে Admin App-এ প্রবেশ সম্পূর্ণ নিষিদ্ধ।
            </span>
          </div>
        )}
        <AuthViews
          authStep="admin_login"
          onChangeStep={() => {}}
          onAuthenticated={(user) => {
            if (user.isAuthorizedAdmin) {
              setUnauthorizedBlockedEmail(null);
              setCurrentUser(user);
            }
          }}
          appTarget="admin"
        />
      </div>
    );
  }

  return (
    <AdminPanelView
      currentAdminEmail={currentUser.email}
      currentAdminRole={currentUser.role}
      users={adminUsers}
      onToggleBanUser={async (uid, reason) => {
        const target = adminUsers.find((u) => u.uid === uid);
        const prevStatus = target?.status || 'active';
        const nextStatus = prevStatus === 'active' ? 'banned' : 'active';
        setAdminUsers((prev) =>
          prev.map((u) => (u.uid === uid ? { ...u, status: nextStatus } : u))
        );
        try {
          await updateDoc(doc(db, 'users', uid), {
            status: nextStatus,
            updatedAt: serverTimestamp(),
          });
        } catch {}
        await writeAdminAuditLog(
          nextStatus === 'banned' ? 'BAN_USER' : 'UNBAN_USER',
          uid,
          reason || `ইউজার স্ট্যাটাস পরিবর্তন: ${nextStatus}`,
          prevStatus,
          nextStatus
        );
      }}
      onChangeUserRole={async (uid, role) => {
        const target = adminUsers.find((u) => u.uid === uid);
        const prevRole = target?.role || 'user';
        setAdminUsers((prev) =>
          prev.map((u) => (u.uid === uid ? { ...u, role } : u))
        );
        try {
          await updateDoc(doc(db, 'users', uid), {
            role,
            updatedAt: serverTimestamp(),
          });
        } catch {}
        await writeAdminAuditLog(
          'CHANGE_USER_ROLE',
          uid,
          `ইউজার রোল পরিবর্তন করে ${role} করা হয়েছে`,
          prevRole,
          role
        );
      }}
      onToggleUserPremium={async (uid) => {
        const target = adminUsers.find((u) => u.uid === uid);
        const prevTier = target?.membershipTier || 'free';
        const nextTier = prevTier === 'premium' ? 'free' : 'premium';
        setAdminUsers((prev) =>
          prev.map((u) =>
            u.uid === uid ? { ...u, membershipTier: nextTier } : u
          )
        );
        try {
          await updateDoc(doc(db, 'users', uid), {
            membershipTier: nextTier,
            updatedAt: serverTimestamp(),
          });
        } catch {}
        await writeAdminAuditLog(
          'TOGGLE_MEMBERSHIP_TIER',
          uid,
          `মেম্বারশিপ টিয়ার পরিবর্তন: ${nextTier}`,
          prevTier,
          nextTier
        );
      }}
      onEditUserProfile={async (uid, fullName, phone) => {
        const target = adminUsers.find((u) => u.uid === uid);
        const prevVal = `${target?.fullName || ''} (${target?.phone || ''})`;
        setAdminUsers((prev) =>
          prev.map((u) => (u.uid === uid ? { ...u, fullName, phone } : u))
        );
        try {
          await updateDoc(doc(db, 'users', uid), {
            fullName,
            phone,
            updatedAt: serverTimestamp(),
          });
        } catch {}
        await writeAdminAuditLog(
          'EDIT_USER_PROFILE',
          uid,
          `প্রোফাইল আপডেট: ${fullName} (${phone})`,
          prevVal,
          `${fullName} (${phone})`
        );
      }}
      onAdjustWallet={async (uid, amountDelta, pointsDelta, reason) => {
        const targetUser = adminUsers.find((u) => u.uid === uid);
        const prevVal = `৳${targetUser?.walletBalance || 0} / ${targetUser?.points || 0} Pts`;
        const txId = 'tx_' + Date.now();
        try {
          await runTransaction(db, async (transaction) => {
            const userRef = doc(db, 'users', uid);
            const userSnap = await transaction.get(userRef);
            if (userSnap.exists()) {
              const data = userSnap.data();
              const currentBal = Number(data.walletBalance) || 0;
              const currentPts = Number(data.points) || 0;
              const nextBal = Math.max(0, currentBal + amountDelta);
              const nextPts = Math.max(0, currentPts + pointsDelta);
              transaction.update(userRef, {
                walletBalance: nextBal,
                points: nextPts,
                updatedAt: serverTimestamp(),
              });
            }
            const txRef = doc(db, 'transactions', txId);
            transaction.set(txRef, {
              id: txId,
              userId: uid,
              type: 'adjustment',
              amountBdt: amountDelta,
              pointsDelta,
              reason,
              adminId: currentUser.email,
              createdAt: serverTimestamp(),
            });
          });
        } catch {}

        setAdminUsers((prev) =>
          prev.map((u) =>
            u.uid === uid
              ? {
                  ...u,
                  walletBalance: Math.max(0, u.walletBalance + amountDelta),
                  points: Math.max(0, u.points + pointsDelta),
                }
              : u
          )
        );
        setAuditLogs((prev) => [
          {
            id: txId,
            userId: uid,
            userName: targetUser?.fullName || 'উদ্যোক্তা',
            type: 'adjustment',
            amountBdt: amountDelta,
            pointsDelta,
            reason,
            adminId: currentUser.email,
            createdAt: 'এইমাত্র',
          },
          ...prev,
        ]);
        await writeAdminAuditLog(
          'WALLET_ADJUSTMENT',
          uid,
          `৳${amountDelta} / ${pointsDelta} Pts সমন্বয় — কারণ: ${reason}`,
          prevVal,
          `Δ ৳${amountDelta} / ${pointsDelta} Pts`
        );
      }}
      withdrawals={adminWithdrawals}
      onProcessWithdrawal={async (id, status, reason) => {
        const targetW = adminWithdrawals.find((w) => w.id === id);
        if (!targetW || targetW.status !== 'pending') return;

        try {
          await runTransaction(db, async (transaction) => {
            const wRef = doc(db, 'withdrawals', id);
            const wSnap = await transaction.get(wRef);
            if (!wSnap.exists()) return;
            const wData = wSnap.data();
            if (wData.status !== 'pending') {
              throw new Error('Already processed');
            }

            if (status === 'approved') {
              const userRef = doc(db, 'users', wData.userId);
              const uSnap = await transaction.get(userRef);
              if (uSnap.exists()) {
                const uData = uSnap.data();
                const curBal = Number(uData.walletBalance) || 0;
                const nextBal = Math.max(
                  0,
                  curBal - (Number(wData.amountBdt) || 0)
                );
                transaction.update(userRef, {
                  walletBalance: nextBal,
                  updatedAt: serverTimestamp(),
                });
              }
              transaction.update(wRef, {
                status: 'approved',
                updatedAt: serverTimestamp(),
              });
            } else {
              transaction.update(wRef, {
                status: 'rejected',
                rejectionReason: reason || 'তথ্য অসম্পূর্ণ',
                updatedAt: serverTimestamp(),
              });
            }
          });
        } catch {}

        setAdminWithdrawals((prev) =>
          prev.map((w) =>
            w.id === id ? { ...w, status, rejectionReason: reason } : w
          )
        );
        if (status === 'approved') {
          setAdminUsers((prev) =>
            prev.map((u) =>
              u.uid === targetW.userId
                ? {
                    ...u,
                    walletBalance: Math.max(
                      0,
                      u.walletBalance - targetW.amountBdt
                    ),
                  }
                : u
            )
          );
        }
        await writeAdminAuditLog(
          status === 'approved' ? 'APPROVE_WITHDRAWAL' : 'REJECT_WITHDRAWAL',
          id,
          reason || `উইথড্রয়াল ${status} (৳${targetW.amountBdt})`,
          'pending',
          status
        );
      }}
      memberships={adminMemberships}
      onVerifyMembership={async (id, status, reason) => {
        const targetM = adminMemberships.find((m) => m.id === id);
        if (!targetM) return;
        const isApproved = status === 'verified' || status === 'active';
        const nextStatus = isApproved ? 'verified' : 'failed';

        try {
          await runTransaction(db, async (transaction) => {
            const mRef = doc(db, 'memberships', id);
            if (isApproved) {
              const uRef = doc(db, 'users', targetM.userId);
              const uSnap = await transaction.get(uRef);
              if (uSnap.exists()) {
                const uData = uSnap.data();
                const curPts = Number(uData.points) || 0;
                transaction.update(uRef, {
                  membershipTier: 'premium',
                  points: curPts + 50,
                  updatedAt: serverTimestamp(),
                });
              }
            }
            transaction.update(mRef, {
              status: nextStatus,
              updatedAt: serverTimestamp(),
            });
          });
        } catch {}

        setAdminMemberships((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
        );
        if (isApproved) {
          setAdminUsers((prev) =>
            prev.map((u) =>
              u.uid === targetM.userId
                ? {
                    ...u,
                    membershipTier: 'premium',
                    points: u.points + 50,
                  }
                : u
            )
          );
        }
        await writeAdminAuditLog(
          isApproved ? 'VERIFY_MEMBERSHIP' : 'REJECT_MEMBERSHIP',
          id,
          reason || `মেম্বারশিপ পেমেন্ট ${nextStatus} (${targetM.userName})`,
          targetM.status,
          nextStatus
        );
      }}
      orders={adminOrders}
      onUpdateOrderStatus={async (orderId, status) => {
        const targetOrd = adminOrders.find((o) => o.id === orderId);
        const prevStatus = targetOrd?.status || 'placed';
        setAdminOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        try {
          await updateDoc(doc(db, 'orders', orderId), { status });
        } catch {}
        await writeAdminAuditLog(
          'UPDATE_ORDER_STATUS',
          orderId,
          `অর্ডার স্ট্যাটাস পরিবর্তন: ${status}`,
          prevStatus,
          status
        );
      }}
      ideas={ideas}
      onAddIdea={async (newIdea) => {
        setIdeas((prev) => [newIdea, ...prev]);
        try {
          await setDoc(doc(db, 'businessIdeas', newIdea.id), {
            ...newIdea,
            createdAt: serverTimestamp(),
          });
        } catch {}
        await writeAdminAuditLog(
          'CREATE_BUSINESS_IDEA',
          newIdea.id,
          `নতুন বিজনেস আইডিয়া যোগ: ${newIdea.title}`,
          'none',
          newIdea.title
        );
      }}
      onEditIdea={async (updatedIdea) => {
        setIdeas((prev) =>
          prev.map((i) => (i.id === updatedIdea.id ? updatedIdea : i))
        );
        try {
          await updateDoc(doc(db, 'businessIdeas', updatedIdea.id), {
            ...updatedIdea,
          });
        } catch {}
        await writeAdminAuditLog(
          'EDIT_BUSINESS_IDEA',
          updatedIdea.id,
          `বিজনেস আইডিয়া সম্পাদনা: ${updatedIdea.title}`,
          updatedIdea.id,
          updatedIdea.title
        );
      }}
      onToggleIdeaFeatured={async (id) => {
        const target = ideas.find((i) => i.id === id);
        const nextFeat = !target?.isFeatured;
        setIdeas((prev) =>
          prev.map((i) => (i.id === id ? { ...i, isFeatured: nextFeat } : i))
        );
        try {
          await updateDoc(doc(db, 'businessIdeas', id), {
            isFeatured: nextFeat,
          });
        } catch {}
        await writeAdminAuditLog(
          'TOGGLE_IDEA_FEATURED',
          id,
          `ফিচার্ড স্ট্যাটাস: ${nextFeat}`,
          String(!nextFeat),
          String(nextFeat)
        );
      }}
      onDeleteIdea={async (id) => {
        setIdeas((prev) => prev.filter((i) => i.id !== id));
        try {
          await deleteDoc(doc(db, 'businessIdeas', id));
        } catch {}
        await writeAdminAuditLog(
          'DELETE_BUSINESS_IDEA',
          id,
          'বিজনেস আইডিয়া মুছে ফেলা হয়েছে',
          id,
          'deleted'
        );
      }}
      categories={categories}
      onToggleCategory={async (id) => {
        const target = categories.find((c) => c.id === id);
        const nextEnabled = !target?.enabled;
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, enabled: nextEnabled } : c))
        );
        try {
          await updateDoc(doc(db, 'categories', id), {
            enabled: nextEnabled,
          });
        } catch {}
        await writeAdminAuditLog(
          'TOGGLE_CATEGORY',
          id,
          `ক্যাটাগরি স্ট্যাটাস পরিবর্তন: ${nextEnabled ? 'enabled' : 'disabled'}`,
          String(!nextEnabled),
          String(nextEnabled)
        );
      }}
      onAddCategory={async (cat) => {
        setCategories((prev) =>
          prev.some((c) => c.id === cat.id)
            ? prev.map((c) => (c.id === cat.id ? cat : c))
            : [...prev, cat]
        );
        try {
          await setDoc(
            doc(db, 'categories', cat.id),
            {
              ...cat,
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch {}
        await writeAdminAuditLog(
          'SAVE_CATEGORY',
          cat.id,
          `ক্যাটাগরি সংরক্ষণ/সম্পাদনা: ${cat.nameBn}`,
          'category',
          cat.nameBn
        );
      }}
      products={products}
      onModerateProduct={async (id, status) => {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
        try {
          await updateDoc(doc(db, 'products', id), { status });
        } catch {}
        await writeAdminAuditLog(
          'MODERATE_PRODUCT',
          id,
          `মার্কেটপ্লেস পণ্য মডারেশন: ${status}`,
          'pending',
          status
        );
      }}
      notices={notices}
      onAddNotice={async (n) => {
        const noticeId = 'not_' + Date.now();
        const newNotice: NoticeRecord = {
          ...n,
          id: noticeId,
          createdAt: 'এইমাত্র',
        };
        setNotices((prev) => [newNotice, ...prev]);
        try {
          await setDoc(doc(db, 'notices', noticeId), {
            ...n,
            id: noticeId,
            createdAt: serverTimestamp(),
          });
        } catch {}
        await writeAdminAuditLog(
          'PUBLISH_NOTICE',
          noticeId,
          `নোটিশ প্রকাশ: ${n.title} (${n.targetAudience})`,
          'draft',
          'published'
        );
      }}
      onDeleteNotice={async (id) => {
        setNotices((prev) => prev.filter((n) => n.id !== id));
        try {
          await deleteDoc(doc(db, 'notices', id));
        } catch {}
        await writeAdminAuditLog(
          'DELETE_NOTICE',
          id,
          'নোটিশ মুছে ফেলা হয়েছে',
          id,
          'deleted'
        );
      }}
      auditLogs={auditLogs}
      adminSecurityLogs={adminSecurityLogs}
      investments={adminInvestments}
      onManageInvestment={async (id, action) => {
        const target = adminInvestments.find((i) => i.id === id);
        if (!target) return;

        if (action === 'approve' || action === 'reject') {
          const nextStatus = action === 'approve' ? 'active' : 'rejected';
          setAdminInvestments((prev) =>
            prev.map((i) => (i.id === id ? { ...i, status: nextStatus } : i))
          );
          try {
            await updateDoc(doc(db, 'investments', id), {
              status: nextStatus,
              updatedAt: serverTimestamp(),
            });
            // Sync user's unlockedPackages in Firestore
            if (target.userId && target.projectId) {
              const userRef = doc(db, 'users', target.userId);
              await runTransaction(db, async (tx) => {
                const uSnap = await tx.get(userRef);
                if (uSnap.exists()) {
                  const existingUnlocked = Array.isArray(uSnap.data().unlockedPackages)
                    ? uSnap.data().unlockedPackages
                    : [];
                  if (action === 'approve') {
                    if (!existingUnlocked.includes(target.projectId)) {
                      tx.update(userRef, {
                        unlockedPackages: [...existingUnlocked, target.projectId],
                      });
                    }
                  } else {
                    tx.update(userRef, {
                      unlockedPackages: existingUnlocked.filter(
                        (pkgId: string) => pkgId !== target.projectId
                      ),
                    });
                  }
                }
              });
            }
          } catch {}
          await writeAdminAuditLog(
            action === 'approve' ? 'APPROVE_INVESTMENT' : 'REJECT_INVESTMENT',
            id,
            `ইনভেস্টমেন্ট/প্যাকেজ (${target.projectTitle}): ${nextStatus}`,
            target.status,
            nextStatus
          );
          return;
        }

        if (action === 'pay_profit') {
          const totalPayout =
            Number(target.amountBdt) + Number(target.expectedMonthlyProfitBdt);
          setAdminInvestments((prev) =>
            prev.map((i) =>
              i.id === id
                ? {
                    ...i,
                    status: 'completed',
                    totalProfitPaidBdt:
                      (Number(i.totalProfitPaidBdt) || 0) + totalPayout,
                  }
                : i
            )
          );
          setAdminUsers((prev) =>
            prev.map((u) =>
              u.uid === target.userId
                ? { ...u, walletBalance: (u.walletBalance || 0) + totalPayout }
                : u
            )
          );
          try {
            await updateDoc(doc(db, 'investments', id), {
              status: 'completed',
              totalProfitPaidBdt:
                (Number(target.totalProfitPaidBdt) || 0) + totalPayout,
              updatedAt: serverTimestamp(),
            });
          } catch {}
          try {
            const txId = 'tx_inv_' + Date.now();
            await runTransaction(db, async (transaction) => {
              const userRef = doc(db, 'users', target.userId);
              const uSnap = await transaction.get(userRef);
              if (uSnap.exists()) {
                const curBal = Number(uSnap.data().walletBalance) || 0;
                transaction.update(userRef, {
                  walletBalance: curBal + totalPayout,
                  updatedAt: serverTimestamp(),
                });
              }
              const txRef = doc(db, 'transactions', txId);
              transaction.set(txRef, {
                id: txId,
                userId: target.userId,
                userName: target.userName,
                type: 'reward',
                amountBdt: totalPayout,
                pointsDelta: 0,
                reason: `প্যাকেজ/ইনভেস্টমেন্ট আসল + লাভ ফেরত: ${target.projectTitle}`,
                adminId: currentUser.uid,
                createdAt: serverTimestamp(),
              });
            });
          } catch {}
          await writeAdminAuditLog(
            'PAY_INVESTMENT_PROFIT',
            id,
            `ইউজারের ওয়ালেটে আসল+লাভ জমা: ৳${totalPayout} (${target.projectTitle})`,
            target.status,
            'completed'
          );
        }
      }}
      onExitAdmin={() => {
        if (onExitToUserPreview) {
          onExitToUserPreview();
        } else {
          window.location.href = '/';
        }
      }}
      onLogoutAdmin={handleAdminLogout}
    />
  );
}
