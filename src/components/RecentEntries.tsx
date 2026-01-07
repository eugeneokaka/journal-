"use client";

import { useEffect, useState } from "react";

interface Entry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function RecentEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/entries?limit=3");
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (error) {
        console.error("Failed to fetch entries", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntries();
  }, []);

  if (isLoading) {
    return <div className="mt-12 text-gray-500">Loading your memories...</div>;
  }

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 w-full max-w-2xl px-4">
      <h2 className="mb-6 text-2xl font-bold text-black">Recent Entries</h2>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border-2 border-[#FFB703] bg-white p-6 shadow-sm transition-transform hover:scale-[1.01]"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-black">{entry.title}</h3>
              <span className="text-xs font-medium text-gray-500">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 line-clamp-3 text-gray-700">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
