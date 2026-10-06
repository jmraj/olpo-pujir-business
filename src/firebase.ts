import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  browserLocalPersistence,
  setPersistence,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Ensure persistent login session across page reloads
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Auth persistence warning:', err);
});

export const isGoogleSignInAvailable = Boolean(
  firebaseConfig &&
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

let cachedAccessToken: string | null = null;

export interface FirestoreUserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'user' | 'seller' | 'support' | 'moderator' | 'admin' | 'super_admin';
  status: 'active' | 'banned';
  membershipTier: 'free' | 'premium';
  walletBalance: number;
  points: number;
  referralCode: string;
  referredBy?: string;
  favorites?: string[];
  checklistProgress?: string;
  photoURL?: string;
  isAuthorizedAdmin: boolean;
}

export function getBengaliAuthError(error: unknown): string {
  const err = error as { code?: string; message?: string };
  const code = err?.code || '';
  const msg = err?.message || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'এই ইমেইল ঠিকানা দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন অথবা অন্য ইমেইল ব্যবহার করুন।';
    case 'auth/invalid-email':
      return 'প্রদত্ত ইমেইল ঠিকানাটি সঠিক নয়। অনুগ্রহ করে সঠিক ইমেইল লিখুন (যেমন: name@example.com)।';
    case 'auth/weak-password':
      return 'পাসওয়ার্ডটি দুর্বল। নিরাপত্তার জন্য কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।';
    case 'auth/user-disabled':
      return 'আপনার অ্যাকাউন্টটি স্থগিত করা হয়েছে। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।';
    case 'auth/too-many-requests':
      return 'অতিরিক্তবার ভুল চেষ্টার কারণে সাময়িকভাবে লগইন বন্ধ রয়েছে। কিছুক্ষণ পর চেষ্টা করুন অথবা "পাসওয়ার্ড ভুলে গেছেন?" ব্যবহার করুন।';
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
      return 'Firebase Console-এ এখনো এই লগইন পদ্ধতিটি (Email/Password বা Google Sign-In) সক্রিয় (Enable) করা হয়নি। Firebase Console > Authentication > Sign-in method থেকে এটি চালু করুন।';
    case 'auth/popup-closed-by-user':
      return 'গুগল সাইন-ইন পপআপ উইন্ডোটি লগইন সম্পন্ন হওয়ার আগেই বন্ধ করা হয়েছে।';
    case 'auth/popup-blocked':
      return 'আপনার ব্রাউজার পপআপ ব্লক করেছে। পপআপ অনুমতি দিয়ে আবার চেষ্টা করুন।';
    case 'auth/unauthorized-domain':
      return 'এই ডোমেইনটি এখনো Firebase Console > Authentication > Settings > Authorized domains তালিকায় যুক্ত করা হয়নি।';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট সংযোগে সমস্যা হয়েছে। আপনার নেটওয়ার্ক সংযোগ যাচাই করে আবার চেষ্টা করুন।';
    default:
      if (msg.includes('permission-denied') || msg.includes('PERMISSION_DENIED')) {
        return 'নিরাপত্তা নীতিমালার কারণে এই তথ্যে প্রবেশাধিকার নেই (Permission Denied)।';
      }
      return 'অথেনটিকেশন সম্পন্ন করা যায়নি। অনুগ্রহ করে আপনার তথ্য যাচাই করে আবার চেষ্টা করুন।';
  }
}

export async function verifyAndSyncUserProfile(
  user: User,
  registrationData?: {
    fullName?: string;
    phone?: string;
    referredBy?: string;
  }
): Promise<FirestoreUserProfile> {
  const userDocRef = doc(db, 'users', user.uid);
  const adminDocRef = doc(db, 'admins', user.uid);

  // 1. Check if user profile already exists in Firestore
  const userSnap = await getDoc(userDocRef);

  // 2. Check if user has an admin document in `/admins/{uid}`
  let hasAdminDoc = false;
  try {
    const adminSnap = await getDoc(adminDocRef);
    hasAdminDoc = adminSnap.exists();
  } catch {
    hasAdminDoc = false;
  }

  // If the user is a bootstrap Super Admin email and doesn't have an /admins/{uid} record yet, provision it
  const normalizedUserEmail = (user.email || '').trim().toLowerCase();
  const isBootstrapAdminEmail =
    normalizedUserEmail === 'hasanmehedy670@gmail.com' ||
    normalizedUserEmail === 'admin@alpopujirbebsha.app';

  if (!hasAdminDoc && isBootstrapAdminEmail) {
    try {
      await setDoc(adminDocRef, {
        uid: user.uid,
        email: user.email,
        role: 'super_admin',
        createdAt: serverTimestamp(),
      });
      hasAdminDoc = true;
    } catch {
      hasAdminDoc = true;
    }
  }

  if (userSnap.exists()) {
    const data = userSnap.data();
    const roleFromDb = (data.role || 'user') as FirestoreUserProfile['role'];
    const isAuthorizedAdmin =
      isBootstrapAdminEmail ||
      hasAdminDoc ||
      roleFromDb === 'super_admin' ||
      roleFromDb === 'admin' ||
      roleFromDb === 'moderator' ||
      roleFromDb === 'support';

    return {
      uid: user.uid,
      fullName:
        data.fullName ||
        registrationData?.fullName ||
        user.displayName ||
        'উদ্যোক্তা সদস্য',
      email: data.email || user.email || '',
      phone: data.phone || registrationData?.phone || user.phoneNumber || '',
      role:
        (isBootstrapAdminEmail || hasAdminDoc) && roleFromDb === 'user'
          ? 'super_admin'
          : roleFromDb,
      status: (data.status === 'banned' ? 'banned' : 'active') as
        | 'active'
        | 'banned',
      membershipTier: (data.membershipTier === 'premium'
        ? 'premium'
        : 'free') as 'free' | 'premium',
      walletBalance: Number(data.walletBalance) || 0,
      points: Number(data.points) || 0,
      referralCode:
        data.referralCode ||
        'APB-' +
          user.uid
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 6)
            .toUpperCase(),
      referredBy: data.referredBy || '',
      favorites: Array.isArray(data.favorites) ? data.favorites : [],
      checklistProgress:
        typeof data.checklistProgress === 'string'
          ? data.checklistProgress
          : '',
      photoURL: user.photoURL || undefined,
      isAuthorizedAdmin,
    };
  }

  // 3. Create new user profile in Cloud Firestore after registration / first sign-in
  const cleanCodeSuffix = user.uid
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 6)
    .toUpperCase();
  const referralCode = `APB-${cleanCodeSuffix || 'USER01'}`;
  const initialPoints = registrationData?.referredBy?.trim() ? 50 : 25;
  const fullNameToSave = (
    registrationData?.fullName ||
    user.displayName ||
    (isBootstrapAdminEmail
      ? 'প্রধান অ্যাডমিন (Super Admin)'
      : user.email
      ? user.email.split('@')[0]
      : 'উদ্যোক্তা সদস্য')
  )
    .trim()
    .slice(0, 120);
  const emailToSave = (user.email || 'user@alpopujirbebsha.app')
    .trim()
    .slice(0, 160);
  const phoneToSave = (registrationData?.phone || user.phoneNumber || '')
    .trim()
    .slice(0, 30);
  const referredByToSave = (registrationData?.referredBy || '')
    .trim()
    .slice(0, 64);

  const assignedRole =
    isBootstrapAdminEmail || hasAdminDoc ? 'super_admin' : 'user';

  const newProfilePayload: Record<string, unknown> = {
    uid: user.uid,
    fullName: fullNameToSave || 'উদ্যোক্তা সদস্য',
    email: emailToSave,
    phone: phoneToSave,
    role: assignedRole,
    status: 'active',
    membershipTier: isBootstrapAdminEmail ? 'premium' : 'free',
    walletBalance: 0,
    points: initialPoints,
    referralCode,
    referredBy: referredByToSave,
    favorites: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(userDocRef, newProfilePayload);
  } catch {
    // Fallback if rules require role='user' on initial create
    try {
      await setDoc(userDocRef, { ...newProfilePayload, role: 'user', membershipTier: 'free' });
    } catch {}
  }

  return {
    uid: user.uid,
    fullName: fullNameToSave || 'উদ্যোক্তা সদস্য',
    email: emailToSave,
    phone: phoneToSave,
    role: assignedRole,
    status: 'active',
    membershipTier: isBootstrapAdminEmail ? 'premium' : 'free',
    walletBalance: 0,
    points: initialPoints,
    referralCode,
    referredBy: referredByToSave,
    favorites: [],
    photoURL: user.photoURL || undefined,
    isAuthorizedAdmin: isBootstrapAdminEmail || hasAdminDoc,
  };
}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{
  user: User;
  accessToken: string | null;
} | null> => {
  if (!isGoogleSignInAvailable) {
    throw { code: 'auth/configuration-not-found' };
  }
  const result = await signInWithPopup(auth, googleProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  cachedAccessToken = credential?.accessToken || null;
  return { user: result.user, accessToken: cachedAccessToken };
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const registerWithEmail = async (
  fullName: string,
  email: string,
  password: string
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  if (fullName.trim()) {
    await updateProfile(credential.user, { displayName: fullName.trim() });
  }
  return credential.user;
};

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const cleanEmail = email.trim();
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );
    return credential.user;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    const isBootstrapAdmin =
      (cleanEmail.toLowerCase() === 'admin@alpopujirbebsha.app' ||
        cleanEmail.toLowerCase() === 'hasanmehedy670@gmail.com') &&
      password === 'Admin@2025';
    if (
      isBootstrapAdmin &&
      (code === 'auth/user-not-found' || code === 'auth/invalid-credential')
    ) {
      const created = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );
      await updateProfile(created.user, {
        displayName: 'প্রধান অ্যাডমিন (Super Admin)',
      });
      return created.user;
    }
    throw err;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};

export const logoutFirebase = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();
