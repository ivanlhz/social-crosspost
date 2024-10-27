import { SocialPostForm } from "@/presentation/components/SocialPostForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Social Crosspost</h1>
          <p className="text-sm text-gray-500">
            Post to Twitter and Threads simultaneously
          </p>
        </div>
        <SocialPostForm />
      </div>
    </main>
  );
}
