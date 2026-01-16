"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Entry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

type ModeType = "week" | "search";

interface WeekRange {
  start: Date;
  end: Date;
  label: string;
}

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [mode, setMode] = useState<ModeType>("week");
  const [isLoading, setIsLoading] = useState(true);
  
  // Search mode states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/entries");
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

  // Helper function: Get the first Sunday of the month
  const getFirstSundayOfMonth = (date: Date): Date => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    return new Date(year, month, 1 + daysUntilSunday);
  };

  // Helper function: Generate week ranges for the current month only
  const getWeekRanges = (): WeekRange[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const firstSunday = getFirstSundayOfMonth(now);
    
    const ranges: WeekRange[] = [];
    let currentStart = new Date(firstSunday);
    
    while (currentStart.getMonth() === currentMonth) {
      const start = new Date(currentStart);
      const end = new Date(currentStart);
      end.setDate(end.getDate() + 6);
      
      const monthName = start.toLocaleDateString('en-US', { month: 'short' });
      const label = `${monthName} ${start.getDate()}-${end.getDate()}`;
      
      ranges.push({ start, end, label });
      currentStart.setDate(currentStart.getDate() + 7);
    }
    
    return ranges;
  };

  // Helper function: Group entries by week
  const groupEntriesByWeek = (entries: Entry[]): Map<string, Entry[]> => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const weekRanges = getWeekRanges();
    const grouped = new Map<string, Entry[]>();
    
    const currentMonthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
    
    currentMonthEntries.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      for (const range of weekRanges) {
        const entryDayStart = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
        const rangeStart = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate());
        const rangeEnd = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate());
        
        if (entryDayStart >= rangeStart && entryDayStart <= rangeEnd) {
          if (!grouped.has(range.label)) {
            grouped.set(range.label, []);
          }
          grouped.get(range.label)!.push(entry);
          break;
        }
      }
    });
    
    return grouped;
  };

  const getFilteredEntries = (): Entry[] => {
    return entries.filter(entry => {
      const matchesSearch = searchQuery === "" || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const entryDate = new Date(entry.createdAt);
      const matchesStartDate = !startDate || entryDate >= new Date(startDate);
      const matchesEndDate = !endDate || entryDate <= new Date(endDate + "T23:59:59");
      
      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your Entries</h1>
            <p className="mt-2 text-muted-foreground">Manage and revisit your memories.</p>
          </div>
          
          <div className="bg-muted p-1 rounded-full inline-flex">
            {(["week", "search"] as ModeType[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  mode === m
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {mode === "search" && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
             ))}
           </div>
        ) : mode === "week" ? (
          <div className="space-y-12">
            {Array.from(groupEntriesByWeek(entries)).map(([weekLabel, weekEntries]) => (
              <div key={weekLabel}>
                <h2 className="mb-6 text-xl font-semibold tracking-tight">{weekLabel}</h2>
                {weekEntries.length === 0 ? (
                  <p className="text-muted-foreground italic">No entries this week.</p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {weekEntries.map((entry) => (
                      <EntryCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                )}
              </div>
            ))}
             {groupEntriesByWeek(entries).size === 0 && (
              <EmptyState />
            )}
          </div>
        ) : (
          <div>
            {getFilteredEntries().length === 0 ? (
              <EmptyState message="No entries found matching your search." />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {getFilteredEntries().map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <Link href={`/entries/${entry.id}`} className="absolute inset-0 z-10" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
             {new Date(entry.createdAt).toLocaleDateString(undefined, {
               month: 'short',
               day: 'numeric'
             })}
          </span>
          {entry.updatedAt !== entry.createdAt && (
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Edited</span>
          )}
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors">
          {entry.title}
        </h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {entry.content}
        </p>
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
         <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
           Read more &rarr;
         </span>
         <Link
            href={`/entries/${entry.id}/edit`}
            className="z-20 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
         >
           Edit
         </Link>
      </div>
    </div>
  );
}

function EmptyState({ message = "No entries found." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-20 text-center animate-in fade-in zoom-in-95 duration-500">
      <p className="mb-4 text-muted-foreground">{message}</p>
      <Link
        href="/new-entry"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Write something new
      </Link>
    </div>
  );
}
