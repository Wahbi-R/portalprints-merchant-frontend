import { auth } from "./firebase";

export async function registerUserInDB({ uid, email }) {
  // Get the Firebase ID token
  const token = await auth.currentUser.getIdToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Pass the token in the Authorization header
    },
    body: JSON.stringify({ userId: uid, email }), // Send uid and email
  });

  if (!response.ok) {
    throw new Error("Failed to register user in the database");
  }

  return response.json();
}