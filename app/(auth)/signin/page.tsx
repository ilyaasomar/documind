import React from "react";
import { SigninForm } from "./signin-form";
import { getUser } from "@/lib/actions/get-user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SigninPage() {
  // check if the user already signed in
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user?.id) return redirect("/");
  return <SigninForm />;
}
