import { mutate } from "swr";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Update signUp to return the uid
export const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

export const logOut = async () => {
  signOut(auth).then(() => {
    if (typeof window !== 'undefined') {
          // Clear user data from localStorage
    localStorage.removeItem('cachedUserData');
    }

    // Clear SWR cache for user data
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, null, { revalidate: false });

    console.log("Signed out successfully.");
    return;
  }).catch((error) => {
    // An error happened.
    console.error("Error signing out:", error);
    return;
  });
}