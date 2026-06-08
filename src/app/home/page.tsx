import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-p-0 text-foreground flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md text-center">
        <div className="space-y-3">
          <div className="inline-flex h-16 w-16 cursor-default items-center justify-center rounded-full bg-p-1 text-3xl font-bold text-p-3 shadow-lg">
            💬
          </div>

          <h1 className="cursor-default bg-linear-to-r from-foreground to-p-3 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Open Chat
          </h1>

          <p className="cursor-default text-sm text-foreground-1">
            Open source realtime chat
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-p-1 px-4 py-3 font-semibold text-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-p-2"
          >
            Log In
          </Link>

          <Link
            href="/register"
            className="flex w-full items-center justify-center rounded-xl bg-s-2 px-4 py-3 font-bold text-foreground shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-s-1"
          >
            Register Now
          </Link>
        </div>

        <div className="my-6 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-p-1" />
          <span className="cursor-default text-xs font-semibold uppercase tracking-wider text-foreground-1">
            Or explore
          </span>
          <div className="h-px w-12 bg-p-1" />
        </div>

        <a
          href="https://github.com/linksyyy/open-chat"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-p-1 bg-p-0 px-5 py-2.5 text-sm text-foreground-1 transition-all duration-200 hover:border-p-2 hover:text-p-3"
        >
          <svg
            className="h-5 w-5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.0.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>

          <span>View GitHub Repository</span>
        </a>
      </div>
    </div>
  );
}
