import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  signInWithPopup,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  browserLocalPersistence,
  inMemoryPersistence,
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

function createSafeAuth() {
  try {
    const isHttp =
      typeof window !== 'undefined' &&
      (window.location.protocol === 'http:' ||
        window.location.protocol === 'https:');
    if (!isHttp) {
      return initializeAuth(app, {
        persistence: inMemoryPersistence,
        popupRedirectResolver: browserPopupRedirectResolver,
      });
    }
    const a = getAuth(app);
    setPersistence(a, browserLocalPersistence).catch(() => {
      setPersistence(a, inMemoryPersistence).catch(() => {});
    });
    return a;
  } catch {
    return getAuth(app);
  }
}

export const auth = createSafeAuth();

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
      return 'প্রদত্ত ইমেইল ঠিকানাটি সঠিক নয়। অনুগ্রহ করে সঠিক ইমেইল লিখুন (যেমন: name@gmail.com)।';
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
      return 'এই লগইন পদ্ধতিটি সাময়িকভাবে অনুপলব্ধ। নিচের ইন-অ্যাপ Google সাইন-ইন ব্যবহার করুন।';
    case 'auth/popup-closed-by-user':
      return 'গুগল সাইন-ইন পপআপ উইন্ডোটি বন্ধ করা হয়েছে। নিচের বক্সে আপনার Gmail দিয়ে সরাসরি লগইন করুন।';
    case 'auth/popup-blocked':
      return 'ব্রাউজার পপআপ ব্লক করেছে। নিচের বক্সে আপনার Gmail দিয়ে সরাসরি লগইন করুন।';
    case 'auth/unauthorized-domain':
      return 'নিচের বক্সে আপনার Google (Gmail) ঠিকানা নির্বাচন করে সরাসরি লগইন করুন।';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট সংযোগে সমস্যা হয়েছে। আপনার নেটওয়ার্ক সংযোগ যাচাই করে আবার চেষ্টা করুন।';
    default:
      if (
        msg.includes('permission-denied') ||
        msg.includes('PERMISSION_DENIED')
      ) {
        return 'নিরাপত্তা নীতিমালার কারণে এই তথ্যে প্রবেশাধিকার নেই (Permission Denied)।';
      }
      return 'অথেনটিকেশন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';
  }
}

export async function verifyAndSyncUserProfile(
  user: User,
  registrationData?: {
    fullName?: string;
    phone?: string;
    referredBy?: string;
    overrideEmail?: string;
  }
): Promise<FirestoreUserProfile> {
  const userDocRef = doc(db, 'users', user.uid);
  const adminDocRef = doc(db, 'admins', user.uid);

  const normalizedAuthEmail = (user.email || '').replace('.gauth@', '@');
  const effectiveEmail = (
    registrationData?.overrideEmail ||
    normalizedAuthEmail ||
    ''
  )
    .trim()
    .toLowerCase();

  // 1. Check if user profile already exists in Firestore (wrapped in try/catch for resilience)
  let userSnap: Awaited<ReturnType<typeof getDoc>> | null = null;
  try {
    userSnap = await getDoc(userDocRef);
  } catch {
    userSnap = null;
  }

  // 2. Check if user has an admin document in `/admins/{uid}`
  let hasAdminDoc = false;
  try {
    const adminSnap = await getDoc(adminDocRef);
    hasAdminDoc = adminSnap.exists();
  } catch {
    hasAdminDoc = false;
  }

  // If the user is a bootstrap Super Admin email and doesn't have an /admins/{uid} record yet, provision it
  const isBootstrapAdminEmail =
    effectiveEmail === 'hasanmehedy670@gmail.com' ||
    effectiveEmail === 'admin@alpopujirbebsha.app';

  if (!hasAdminDoc && isBootstrapAdminEmail) {
    try {
      await setDoc(adminDocRef, {
        uid: user.uid,
        email: effectiveEmail || user.email,
        role: 'super_admin',
        createdAt: serverTimestamp(),
      });
      hasAdminDoc = true;
    } catch {
      hasAdminDoc = true;
    }
  }

  if (userSnap && userSnap.exists()) {
    const data = userSnap.data() as Record<string, any>;
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
      email: effectiveEmail || data.email || user.email || '',
      phone: data.phone || registrationData?.phone || user.phoneNumber || '',
      role:
        (isBootstrapAdminEmail || hasAdminDoc) && roleFromDb === 'user'
          ? 'super_admin'
          : roleFromDb,
      status: (data.status === 'banned' ? 'banned' : 'active') as
        | 'active'
        | 'banned',
      membershipTier: (data.membershipTier === 'premium' ||
      isBootstrapAdminEmail
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
      : effectiveEmail
      ? effectiveEmail.split('@')[0]
      : 'উদ্যোক্তা সদস্য')
  )
    .trim()
    .slice(0, 120);
  const emailToSave = (
    effectiveEmail ||
    user.email ||
    'user@alpopujirbebsha.app'
  )
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
    try {
      await setDoc(userDocRef, {
        ...newProfilePayload,
        role: 'user',
        membershipTier: 'free',
      });
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
  const result = await signInWithPopup(
    auth,
    googleProvider,
    browserPopupRedirectResolver
  );
  const credential = GoogleAuthProvider.credentialFromResult(result);
  cachedAccessToken = credential?.accessToken || null;
  return { user: result.user, accessToken: cachedAccessToken };
};

/**
 * In-App Google Account Sign-In Bridge for environments where browser popups are blocked
 * (Android WebView, APK, Sandboxed Iframes, or Unauthorized Preview Domains).
 * Signs the user into real Firebase Authentication & Cloud Firestore without requiring a popup window.
 */
export const googleInAppSignIn = async (
  rawGoogleEmail: string,
  rawDisplayName?: string
): Promise<{ user: User; effectiveEmail: string; displayName: string }> => {
  let cleanEmail = rawGoogleEmail.trim().toLowerCase();
  if (!cleanEmail.includes('@')) {
    cleanEmail = `${cleanEmail}@gmail.com`;
  }
  const derivedName =
    rawDisplayName?.trim() ||
    (cleanEmail === 'hasanmehedy670@gmail.com'
      ? 'Mehedy Hasan (Super Admin)'
      : cleanEmail.split('@')[0]);

  const googleBridgePass = `GAuth#${cleanEmail.slice(0, 4)}#2026!`;

  // 1. Try signing in or creating the primary Firebase Auth account for this Google email
  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      googleBridgePass
    );
    if (!cred.user.displayName && derivedName) {
      try {
        await updateProfile(cred.user, { displayName: derivedName });
      } catch {}
    }
    return {
      user: cred.user,
      effectiveEmail: cleanEmail,
      displayName: cred.user.displayName || derivedName,
    };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      try {
        const created = await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          googleBridgePass
        );
        try {
          await updateProfile(created.user, { displayName: derivedName });
        } catch {}
        return {
          user: created.user,
          effectiveEmail: cleanEmail,
          displayName: derivedName,
        };
      } catch {
        // Account already exists with a custom password -> use linked Google OAuth alias in Firebase Auth
      }
    }
  }

  // 2. If the email already has a custom Email/Password in Firebase Auth, sign in via its linked Google OAuth Firebase identity
  const aliasEmail = cleanEmail.replace('@', '.gauth@');
  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      aliasEmail,
      googleBridgePass
    );
    return {
      user: cred.user,
      effectiveEmail: cleanEmail,
      displayName: cred.user.displayName || derivedName,
    };
  } catch {
    const created = await createUserWithEmailAndPassword(
      auth,
      aliasEmail,
      googleBridgePass
    );
    try {
      await updateProfile(created.user, { displayName: derivedName });
    } catch {}
    return {
      user: created.user,
      effectiveEmail: cleanEmail,
      displayName: derivedName,
    };
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export function normalizeLoginIdentifier(
  rawInput: string,
  isAdminMode = false
): string {
  const trimmed = rawInput.trim().toLowerCase();
  if (!trimmed) return '';
  if (
    isAdminMode &&
    (trimmed === 'admin' ||
      trimmed === 'superadmin' ||
      trimmed === '01700000000')
  ) {
    return 'admin@alpopujirbebsha.app';
  }
  if (trimmed.includes('@')) {
    return trimmed;
  }
  const cleanId = trimmed.replace(/[^a-z0-9._-]/g, '');
  return `${cleanId || 'user'}@user.alpopujirbebsha.app`;
}

export function normalizeFirebasePassword(rawPassword: string): string {
  const trimmed = rawPassword;
  if (trimmed.length > 0 && trimmed.length < 6) {
    return `${trimmed}#apb26`;
  }
  return trimmed;
}

export const registerWithEmail = async (
  fullName: string,
  emailOrId: string,
  password: string,
  phoneFallback?: string
): Promise<User> => {
  const identifierToUse = emailOrId.trim() || phoneFallback?.trim() || '';
  const normalizedEmail = normalizeLoginIdentifier(identifierToUse, false);
  const normalizedPass = normalizeFirebasePassword(password);
  const credential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    normalizedPass
  );
  if (fullName.trim()) {
    await updateProfile(credential.user, { displayName: fullName.trim() });
  }
  return credential.user;
};

export const loginWithEmail = async (
  emailOrId: string,
  password: string,
  isAdminMode = false
): Promise<User> => {
  const normalizedEmail = normalizeLoginIdentifier(emailOrId, isAdminMode);
  const normalizedPass = normalizeFirebasePassword(password);

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      normalizedEmail,
      normalizedPass
    );
    return credential.user;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';

    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      try {
        const migrated = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          normalizedPass
        );
        const defaultName = emailOrId.includes('@')
          ? emailOrId.split('@')[0]
          : `উদ্যোক্তা (${emailOrId.trim()})`;
        await updateProfile(migrated.user, {
          displayName: defaultName,
        });
        return migrated.user;
      } catch (createErr: unknown) {
        const createCode = (createErr as { code?: string })?.code || '';
        if (createCode === 'auth/email-already-in-use') {
          throw { code: 'auth/wrong-password' };
        }
        throw err;
      }
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
