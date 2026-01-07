import Link from "next/link";
import RecentEntries from "../components/RecentEntries";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center py-20 bg-white dark:bg-white text-black">
      <div className="flex flex-col items-center gap-8 p-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
          How is your day going?
        </h1>
        <Link
          href="/new-entry"
          className="rounded-full bg-[#FFB703] px-8 py-4 text-lg font-bold text-black transition-transform hover:scale-105 active:scale-95"
        >
          Create a entry
        </Link>
      </div>
      <RecentEntries />
    </div>
  );
}
