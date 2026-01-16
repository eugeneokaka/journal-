import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            Journal
          </Link>
        </div>
        
        <div>
          <SignedOut>
            <div className="flex items-center gap-4">
              <Link 
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Get Started
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-6">
              <Link 
                href="/entries"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Output
              </Link>
              <ThemeToggle />
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
