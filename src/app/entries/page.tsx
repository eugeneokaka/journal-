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
    
    // Start from the 1st of the month
    const firstDay = new Date(year, month, 1);
    
    // Find the first Sunday
    const dayOfWeek = firstDay.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    
    const firstSunday = new Date(year, month, 1 + daysUntilSunday);
    return firstSunday;
  };

  // Helper function: Generate week ranges for the current month only
  const getWeekRanges = (): WeekRange[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const firstSunday = getFirstSundayOfMonth(now);
    
    const ranges: WeekRange[] = [];
    
    // Start from the first Sunday of the month
    let currentStart = new Date(firstSunday);
    
    // Generate ranges until we go past the current month
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

  // Helper function: Group entries by week (only current month)
  const groupEntriesByWeek = (entries: Entry[]): Map<string, Entry[]> => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const weekRanges = getWeekRanges();
    const grouped = new Map<string, Entry[]>();
    
    // Filter entries to only include current month
    const currentMonthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
    
    currentMonthEntries.forEach(entry => {
      const entryDate = new Date(entry.createdAt);
      
      // Find which week this entry belongs to
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

  // Filter entries for search mode
  const getFilteredEntries = (): Entry[] => {
    return entries.filter(entry => {
      // Title search
      const matchesSearch = searchQuery === "" || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Date range filter
      const entryDate = new Date(entry.createdAt);
      const matchesStartDate = !startDate || entryDate >= new Date(startDate);
      const matchesEndDate = !endDate || entryDate <= new Date(endDate + "T23:59:59");
      
      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 dark:bg-white text-black">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-6 block text-sm font-medium text-gray-500 hover:text-black">
          ← Back to Dashboard
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Your Entries</h1>
          
          {/* Mode Toggle */}
          <div className="flex gap-2 rounded-full bg-gray-100 p-1 w-fit mb-6">
            {(["week", "search"] as ModeType[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  mode === m
                    ? "bg-[#FFB703] text-black shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Search Mode Controls */}
          {mode === "search" && (
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#FFB703] focus:outline-none transition-colors"
              />
              
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FFB703] focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FFB703] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500">Loading your memories...</div>
        ) : mode === "week" ? (
          // Week Mode Display
          <div className="space-y-8">
            {Array.from(groupEntriesByWeek(entries)).map(([weekLabel, weekEntries]) => (
              <div key={weekLabel}>
                <h2 className="text-xl font-bold mb-4 text-gray-800">{weekLabel}</h2>
                {weekEntries.length === 0 ? (
                  <p className="text-gray-400 italic ml-4">No entries this week</p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {weekEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex flex-col justify-between rounded-xl border-2 border-[#FFB703] bg-white p-6 shadow-sm transition-transform hover:scale-[1.02]"
                      >
                        <Link href={`/entries/${entry.id}`} className="block flex-1">
                          <h3 className="mb-2 text-xl font-bold line-clamp-2">{entry.title}</h3>
                          <p className="mb-4 line-clamp-4 text-sm text-gray-600">{entry.content}</p>
                        </Link>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="text-xs font-medium text-gray-400">
                            <span>Created: {new Date(entry.createdAt).toLocaleDateString()}</span>
                            {entry.updatedAt !== entry.createdAt && (
                              <span className="block mt-1">Updated: {new Date(entry.updatedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                          <Link
                            href={`/entries/${entry.id}/edit`}
                            className="text-sm font-bold text-[#FFB703] hover:underline"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {groupEntriesByWeek(entries).size === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
                <p className="mb-4 text-gray-500">No entries found.</p>
                <Link
                  href="/new-entry"
                  className="font-bold text-[#FFB703] hover:underline"
                >
                  Write something new?
                </Link>
              </div>
            )}
          </div>
        ) : (
          // Search Mode Display
          <div>
            {getFilteredEntries().length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
                <p className="mb-4 text-gray-500">No entries found matching your search.</p>
                <Link
                  href="/new-entry"
                  className="font-bold text-[#FFB703] hover:underline"
                >
                  Write something new?
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {getFilteredEntries().map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col justify-between rounded-xl border-2 border-[#FFB703] bg-white p-6 shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <Link href={`/entries/${entry.id}`} className="block flex-1">
                      <h3 className="mb-2 text-xl font-bold line-clamp-2">{entry.title}</h3>
                      <p className="mb-4 line-clamp-4 text-sm text-gray-600">{entry.content}</p>
                    </Link>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs font-medium text-gray-400">
                        <span>Created: {new Date(entry.createdAt).toLocaleDateString()}</span>
                        {entry.updatedAt !== entry.createdAt && (
                          <span className="block mt-1">Updated: {new Date(entry.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <Link
                        href={`/entries/${entry.id}/edit`}
                        className="text-sm font-bold text-[#FFB703] hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
