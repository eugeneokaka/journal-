import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
      <div className="text-xl font-bold text-black">
        <Link href="/">Journal</Link>
      </div>
      <div>
        <SignedOut>
          <div className="flex items-center gap-4">
            <Link 
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-black hover:text-gray-700 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="px-4 py-2 text-sm font-medium text-black bg-[#FFB703] rounded-full hover:bg-[#FFB703]/80 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
