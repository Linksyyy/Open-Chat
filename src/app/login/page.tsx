"use client";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center">
      <div className="flex flex-col bg-p-1 p-8 rounded-4xl min-w-2/9 border border-p-2 shadow-sm">
        <h1 className="text-4xl pb-6 flex w-full justify-center items-center text-foreground font-bold font-sans">
          Log in
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-2">
            <label className="text-xl text-foreground font-sans">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-p-2 text-foreground p-3 rounded-xl border border-p-3 outline-none transition-colors focus:border-s-0 focus:ring-1 focus:ring-s-0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl text-foreground font-sans">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-p-2 text-foreground p-3 rounded-xl border border-p-3 outline-none transition-colors focus:border-s-0 focus:ring-1 focus:ring-s-0"
            />
          </div>

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
