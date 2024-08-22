'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import Toast from "@/components/Toast";

export default function SignInOne() {
  const searchParam = useSearchParams();
  const [authData, setAuthData] = React.useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setError] = React.useState({});

  const submitForm = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", authData);
      setLoading(false);
      const response = res.data;
      if (response.status === 200) {
        signIn("credentials", {
          email: authData.email,
          password: authData.password,
          callbackUrl: "/",
          redirect: true,
        });
      } else if (response.status === 400) {
        setError(response.errors);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error is", err);
    }
  };

  const googleLogin = async () => {
    await signIn("google", {
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {errors && <Toast message={errors} />}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Login
        </h2>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?
          <Link
            href="/register"
            className="font-medium text-blue-600 dark:text-blue-400 transition-colors duration-200 hover:underline ml-2"
          >
            Sign Up
          </Link>
        </p>
        {searchParam.get("message") && (
          <p className="text-red-500 dark:text-red-400 mt-2">
            {searchParam.get("message")}
          </p>
        )}
        <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-900 dark:text-gray-200">
              Email address
            </label>
            <input
              id="email"
              className="mt-2 w-full px-3 py-2 text-sm border rounded-md border-gray-300 bg-transparent placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500 dark:focus:ring-blue-400"
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setAuthData({ ...authData, email: e.target.value })
              }
            />
            <span className="text-red-500 dark:text-red-400 font-bold text-sm">{errors?.email}</span>
          </div>
          <div>
            <label htmlFor="password" className="block text-base font-medium text-gray-900 dark:text-gray-200">
              Password
            </label>
            <input
              id="password"
              className="mt-2 w-full px-3 py-2 text-sm border rounded-md border-gray-300 bg-transparent placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500 dark:focus:ring-blue-400"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setAuthData({ ...authData, password: e.target.value })
              }
            />
            <span className="text-red-500 dark:text-red-400 font-bold text-sm">{errors?.password}</span>
            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400">
                Forgot password?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:${loading ? "bg-gray-700" : "bg-blue-600"} ${loading ? "bg-gray-600" : "bg-blue-600"}`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </div>
        </form>
        <p className="text-center my-3 text-gray-500 dark:text-gray-400">
          -- OR --
        </p>
        <div className="space-y-3">
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
              className="mr-3"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </section>
  );
}
