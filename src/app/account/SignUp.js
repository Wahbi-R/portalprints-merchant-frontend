'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "../../lib/auth";
import { registerUserInDB } from "@/lib/api";
import { useUserData } from "@/hooks/useUserData";

export default function SignUp() {
    const { refreshUser } = useUserData(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password || !confirmPassword) {
            setError("Please fill out all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            // Sign up with Firebase and get uid
            await signUp(email, password);
            const uid = auth.currentUser.uid;
            const userEmail = auth.currentUser.email
            // Register user in PostgreSQL database
            await registerUserInDB({ uid, userEmail });

            // Refresh SWR user data to make it available globally
            await refreshUser(); 

            // Redirect to settings or dashboard
            router.push("/settings");
        } catch (err) {
            console.log("Sign-Up Error:", err);
            setError("Failed to sign up. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center p-8 space-y-6 w-full md:w-1/2">
            <h1 className="text-4xl font-bold">Sign Up</h1>
            <form onSubmit={handleSignUp} className="flex flex-col w-full max-w-md space-y-4">
                <p className="text-xl text-gray-400 self-start">Create your account</p>
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-3 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                    type="submit"
                    className={`bg-green-600 hover:bg-green-700 p-3 rounded-md text-white font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign up"}
                </button>
            </form>
        </div>
    );
}