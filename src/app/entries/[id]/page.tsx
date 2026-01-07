"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Entry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEntry() {
      try {
        const res = await fetch(`/api/entries/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Entry not found");
          } else {
            setError("Failed to load entry");
          }
          return;
        }
        const data = await res.json();
        setEntry(data);
      } catch (err) {
        setError("Something went wrong");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchEntry();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-white text-black">
        <div className="text-gray-500">Loading your memory...</div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-white text-black">
        <h1 className="mb-4 text-2xl font-bold text-red-500">{error || "Entry not found"}</h1>
        <Link
          href="/entries"
          className="text-[#FFB703] hover:underline"
        >
          ← Back to entries
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 dark:bg-white text-black">
      <div className="mx-auto max-w-3xl">
        <Link 
          href="/entries" 
          className="mb-8 inline-block text-sm font-medium text-gray-500 hover:text-black transition-colors"
        >
          ← Back to Entries
        </Link>
        
        <article className="rounded-2xl border-2 border-[#FFB703] bg-white p-8 shadow-sm">
          <header className="mb-8 border-b border-gray-100 pb-8">
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{entry.title}</h1>
            <time className="text-sm font-medium text-gray-500">
              {new Date(entry.createdAt).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </header>
          
          <div className="prose prose-lg max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
            {entry.content}
          </div>
        </article>
      </div>
    </div>
  );
}
