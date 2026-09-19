import type { Metadata } from "next";
import { SignupForm } from "./signup-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
export const metadata: Metadata = {
  title: "Create your account · DocuMind",
};

export default async function SignupPage() {
  // check if the user already signed in
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.id) return redirect("/");
  return <SignupForm />;
}
