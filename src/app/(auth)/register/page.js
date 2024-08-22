'use client';

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Toast from "@/components/Toast";

export default function SignUp() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [userState, setUserState] = useState({
    email: "",
    password: "",
    name: "",
    password_confirmation: "",
  });

  const [errors, setError] = useState({});

  const submitForm = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/register", userState);
      setLoading(false);
      if (response.data.status === 200) {
        router.push(`/login?message=${response.data.msg}`);
      } else {
        router.push(`/register?error=${response.data.msg}`);
        setError(response.data.errors || {});
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during sign-up:", error);
    }
  };

  // * Google login
  const googleLogin = async () => {
    await signIn("google", {
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <section className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      {errors && <Toast message={errors} />}
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sign Up
        </h2>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Already have an account?
          <Link
            href="/login"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline ml-2"
          >
            Sign In
          </Link>
        </p>
        <form className="mt-8" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Full Name
              </label>
              <input
                className="mt-2 block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
                type="text"
                placeholder="Full Name"
                id="name"
                onChange={(e) =>
                  setUserState({ ...userState, name: e.target.value })
                }
              />
              <span className="text-red-500 text-sm">{errors?.name}</span>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Email address
              </label>
              <input
                className="mt-2 block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
                type="email"
                placeholder="Email"
                id="email"
                onChange={(e) =>
                  setUserState({ ...userState, email: e.target.value })
                }
              />
              <span className="text-red-500 text-sm">{errors?.email}</span>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Password
              </label>
              <input
                className="mt-2 block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
                type="password"
                placeholder="Password"
                id="password"
                onChange={(e) =>
                  setUserState({ ...userState, password: e.target.value })
                }
              />
              <span className="text-red-500 text-sm">{errors?.password}</span>
            </div>
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Confirm Password
              </label>
              <input
                className="mt-2 block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-400"
                type="password"
                placeholder="Confirm Password"
                id="password_confirmation"
                onChange={(e) =>
                  setUserState({
                    ...userState,
                    password_confirmation: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <button
                type="submit"
                className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 ${
                  loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600"
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Create Account"}
              </button>
            </div>
          </div>
        </form>
        <p className="text-center my-3 text-gray-500 dark:text-gray-400">-- OR --</p>
        <div className="space-y-3 mt-3">
          <button
            type="button"
            className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold px-4 py-2 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
            onClick={googleLogin}
          >
            <Image
              src="/google_icon.png"
              height={30}
              width={30}
              alt="Google Icon"
              className="mr-2"
            />
            Sign up with Google
          </button>
        </div>
      </div>
    </section>
  );
}
