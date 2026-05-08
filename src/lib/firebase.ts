import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, limit, serverTimestamp, Timestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

// Firestore helpers
export const saveTravelPlan = async (userId: string, plan: any) => {
  const planRef = doc(collection(db, `plans`));
  const planData = {
    ...plan,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(planRef, planData);
  return planRef.id;
};

export const getUserPlans = async (userId: string) => {
  const q = query(
    collection(db, `plans`),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPlanById = async (planId: string) => {
  const planRef = doc(db, `plans/${planId}`);
  const planSnap = await getDoc(planRef);
  if (planSnap.exists()) {
    return { id: planSnap.id, ...planSnap.data() };
  }
  return null;
};
