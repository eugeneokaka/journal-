import Link from "next/link";
import RecentEntries from "../components/RecentEntries";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="relative flex w-full flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:py-32">
        <div className="relative z-10 max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Capturing moments, <br className="hidden sm:block" />
              <span className="text-primary italic">one day at a time.</span>
            </h1>
            <p className="mx-auto max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8">
              A private space for your thoughts, dreams, and memories. 
              Simple, beautiful, and yours.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/new-entry"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground transition-all duration-300 hover:w-56 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="mr-2">Start Writing</span>
              <span className="ml-2 transform opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-20">
          <div className="h-[500px] w-[500px] rounded-full bg-primary blur-[128px]" />
        </div>
      </div>

      <RecentEntries />
      
      {/* Footer-like spacer */}
      <div className="h-20" />
    </div>
  );
}
