import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { EmailAuthForm } from "@/components/EmailForm";

export default async function LoginPage() {
  const session = (await cookies()).get("session");

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Sign in to continue to your account
          </p>
        </div>

        <GoogleSignInButton />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs text-neutral-500">OR</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <EmailAuthForm />

        <p className="mt-6 text-center text-xs text-neutral-500">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
