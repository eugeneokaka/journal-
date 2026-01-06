import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center py-24 px-4 bg-white dark:bg-white min-h-screen">
      <SignUp />
    </div>
  );
}
