"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

export default function AdminLogin() {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await signIn("credentials", {
        email: authState.email,
        password: authState.password,
        redirect: false,
      });

      if (data?.error) {
        setError(data.error);
      } else if (data?.ok) {
        router.replace("/admin/dashboard");
      } else {
        setError("Unexpected error occurred");
      }
    } catch (err) {
      setError("An error occurred during sign-in");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      {error && <Toast message={error} />}
      <div className="w-[400px] bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Admin Login
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Welcome back! Please sign in to continue.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full px-4 py-2 h-12 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setAuthState({ ...authState, email: e.target.value })
              }
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 h-12 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setAuthState({ ...authState, password: e.target.value })
              }
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg p-3 text-white font-semibold transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
