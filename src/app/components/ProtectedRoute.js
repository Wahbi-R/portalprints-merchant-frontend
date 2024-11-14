"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import AccountPage from "../account/page";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
  }, [user, loading, router]);

  if (!user && !loading) return <><AccountPage/></>;

  return <>{children}</>;
}
