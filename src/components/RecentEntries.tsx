"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    return (
      <div className="mt-16 grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="mt-12 text-center text-muted-foreground">
        <p>No entries yet. Start writing your story.</p>
      </div>
    );
  }

  return (
    <div className="mt-24 w-full max-w-5xl px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Recent Thoughts</h2>
        <Link href="/entries" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/entries/${entry.id}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                {entry.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                {entry.content}
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Read more &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
