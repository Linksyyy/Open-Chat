"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LoginResponse } from "../api/login/route";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 4) {
      setError("Password must be at least 4 characters long");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setError(data.message || "An error occurred");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
        }),
      );

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError("Failed to connect to the server");
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center">
      <div className="flex flex-col bg-p-1 p-8 rounded-4xl min-w-2/9 border border-p-2 shadow-sm">
        <h1 className="text-4xl pb-6 flex w-full justify-center items-center text-foreground font-bold font-sans">
          Log in
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xl text-foreground font-sans">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-p-2 text-foreground p-3 rounded-xl border border-p-3 outline-none transition-colors focus:border-s-0 focus:ring-1 focus:ring-s-0"
              onChange={(e) => setUsername(e.target.value.trim())}
              value={username}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl text-foreground font-sans">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-p-2 text-foreground p-3 rounded-xl border border-p-3 outline-none transition-colors focus:border-s-0 focus:ring-1 focus:ring-s-0"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <div className="flex gap-4 mt-4">
            <Link
              href="/home"
              className="flex-1 bg-p-2 hover:bg-p-3 text-foreground font-sans font-medium p-3 rounded-xl transition-colors cursor-pointer text-lg text-center border border-p-3"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 bg-s-0 hover:bg-s-1 text-foreground font-sans font-medium p-3 rounded-xl transition-colors cursor-pointer text-md text-center"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
