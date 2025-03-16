import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branded area */}
      <div className="hidden flex-col items-center justify-center bg-blue-600 p-8 text-white md:flex md:w-1/2">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-6xl font-bold">Dalio AI</h1>
          <p className="text-xl">Seu agente de análise financeira</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-gray-50 p-4 md:w-1/2">
        <SignIn />
      </div>
    </div>
  );
}
