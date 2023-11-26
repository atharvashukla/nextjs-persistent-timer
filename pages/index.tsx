/**
 * v0 by Vercel.
 * @see https://v0.dev/t/YmGT9yuQQUH
 */
import Link from "next/link";
import Timer from "./components/timer";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <code className="text-xl font-bold">nextjs-persistent-timer</code>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            {/* <IconToggle className="text-lg" /> */}
            <span className="text-sm">Toggle Timer</span>
          </div>
          <a aria-label="Github" href="#" rel="noreferrer" target="_blank">
            {/* <IconGithub className="text-lg" /> */}
          </a>
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center flex-grow">
        <section className="space-y-3 w-96">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            Persistent client-side countdown
          </h1>
          <p className="text-lg text-center text-gray-600">
            The countdown has a configurable restart delay, expiry time. The
            timer persists across browser sessions.
          </p>
        </section>
        <div className="flex flex-col items-center justify-center space-y-4 mt-8">
          <div className="w-64 h-64 bg-gray-200 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-center">
            <p className="text-6xl font-bold text-gray-900 dark:text-gray-100">
              <Timer />
            </p>
          </div>
        </div>
        <section className="mt-16">
          <Link
            className="text-md font-semibold flex justify-center items-center space-x-2 bg-gray-300 px-2 py-1 rounded-lg"
            href="#"
          >
            <span>
              Read more about the <em>Why</em> and <em>How</em> in this blog
              post
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
