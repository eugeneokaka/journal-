"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Entry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function EntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEntry() {
      try {
        const res = await fetch(`/api/entries/${id}`);
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

    if (id) {
      fetchEntry();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <div className="text-muted-foreground animate-pulse">Retrieving memory...</div>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-foreground">
        <h1 className="mb-4 text-2xl font-bold text-destructive">{error || "Entry not found"}</h1>
        <Link
          href="/entries"
          className="text-primary hover:underline"
        >
          ← Back to entries
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
           <Link 
            href="/entries" 
            className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
            Back to Entries
          </Link>
        </div>
        
        <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <header className="mb-10 border-b border-border pb-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:leading-[1.1]">
                {entry.title}
              </h1>
              <Link
                href={`/entries/${entry.id}/edit`}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <span className="mr-2">Edit</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </Link>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <time className="flex items-center">
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {new Date(entry.createdAt).toLocaleDateString(undefined, {
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </time>
              <time className="flex items-center">
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {new Date(entry.createdAt).toLocaleTimeString(undefined, {
                   hour: '2-digit',
                   minute: '2-digit'
                })}
              </time>
            </div>
          </header>
          
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {entry.content}
          </div>
        </article>
      </div>
    </div>
  );
}
