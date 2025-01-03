'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Image from "next/image";

export default function AccountPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialMode = searchParams.get("mode") || "signin"; // Default to "signin"
    const [isSignUp, setIsSignUp] = useState(initialMode === "signup");

    const toggleMode = () => {
        setIsSignUp((prev) => !prev);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-background-gray">
            {/* Outer Container with rounded edges */}
            <div className="flex flex-col md:flex-row w-full h-screen bg-gray-900 text-white md:p-12 space-y-6 md:space-y-0 md:space-x-6">
                {/* Conditional Rendering of SignIn and SignUp Components */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 space-y-6">
                    {isSignUp ? <SignUp /> : <SignIn />}
                    <button 
                        onClick={toggleMode}
                        className="text-sm text-gray-500 hover:underline"
                    >
                        {isSignUp ? "Already have an account? Sign in" : "Create an account"}
                    </button>
                </div>

                {/* Right Side: Testimonial and Info Sheet - Hidden on Mobile */}
                <div className="hidden md:flex flex-col justify-center items-center bg-green-700 p-8 rounded-3xl">
                    {/* <div>
                        <h2 className="text-2xl font-bold"></h2>
                    </div> */}
                    <div>
                        <Image
                            src="/profile.png"
                            alt="Profile"
                            className="h-auto w-full rounded-full border border-gray-300"
                            width={0}
                            height={0}
                            sizes="100vw" style={{ width: '100%', height: 'auto' }}
                        />
                        <p className="text-4xl text-center text-gray-200 ms-2 p-2">
                            Unlock Effortless Business Growth.
                        </p>
                        {/* <p className="text-xl font-bold text-gray-300 ms-2">Sala&apos;s Mom</p>
                        <p className="text-sm text-gray-300 ms-2">Product Designer & Seller @ Arieze</p> */}
                    </div>
                    {/* <div className="bg-white p-6 rounded-3xl text-black">
                        <h3 className="font-bold">Work smarter, not harder with Portal</h3>
                        <p className="text-sm">Be among the first to experience the best way to enhance your 3D Printing Business.</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
