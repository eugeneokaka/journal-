"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Entry {
  id: string;
  title: string;
  content: string;
}

export default function EditEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Unwrap params using React.use()
  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const res = await fetch(`/api/entries/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);
        } else {
          // Handle error (e.g., entry not found)
          console.error("Failed to fetch entry");
          router.push("/entries");
        }
      } catch (error) {
        console.error("Error fetching entry:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchEntry();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push("/entries");
        router.refresh();
      } else {
        console.error("Failed to update entry");
      }
    } catch (error) {
      console.error("Error updating entry:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 py-8 dark:bg-white text-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#FFB703]"></div>
          <p className="text-gray-500 font-medium">Loading your entry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 dark:bg-white text-black">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/entries"
          className="mb-6 block text-sm font-medium text-gray-500 hover:text-black"
        >
          ← Back to Entries
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Edit Entry</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#FFB703]"
              placeholder="Give your memory a title..."
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full resize-none rounded-lg border-2 border-gray-200 px-4 py-3 outline-none transition-colors focus:border-[#FFB703]"
              placeholder="Write your thoughts..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-[#FFB703] px-8 py-3 font-bold text-black transition-transform hover:scale-105 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/entries"
              className="rounded-full bg-gray-100 px-8 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
