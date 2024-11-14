import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signInWithGoogle } from "../../lib/auth";
import { registerUserInDB } from "../../lib/api";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { auth } from "@/lib/firebase";
import { useUserData } from "@/hooks/useUserData";

export default function SignIn() {
    const { refreshUser } = useUserData();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError(!email ? "Enter an email" : "Enter your password");
            return;
        }

        setLoading(true);
        try {
            // Sign in with Firebase and get uid
            await signIn(email, password);
            const uid = auth.currentUser.uid;

            // save the user in the database if they aren't (just in case for previously made accounts)
            await registerUserInDB({ uid, email });
            
            // Revalidate SWR user data after sign-in
            refreshUser();

            // Direct to orders
            router.push("/orders");
        } catch (err) {
            setError("Failed to sign in. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);

        try {
            await signInWithGoogle();
            const uid = auth.currentUser.uid;
            const email = auth.currentUser.email;
            console.log("email", email)
            await registerUserInDB({ uid, email });

            // Revalidate SWR user data after Google sign-in
            refreshUser();

            router.push("/orders");
        } catch (err) {
            setError("Failed to sign in with Google.");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center p-8 space-y-6 w-full md:w-1/2">
            <h1 className="text-4xl font-bold">Login</h1>
            <form onSubmit={handleSignIn} className="flex flex-col w-full max-w-md space-y-4">
                <p className="text-xl text-gray-400 self-start">Please enter your account details</p>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                    type="submit"
                    className={`bg-green-600 hover:bg-green-700 p-3 rounded-md text-white font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
            <div className="">
                <GoogleSignInButton onClick={handleGoogleSignIn} />
            </div>
        </div>
    );
}
