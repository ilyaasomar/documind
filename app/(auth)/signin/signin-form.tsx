"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Email must be at least 8 characters."),
});

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { signIn, signUp } from "@/lib/auth-client";
import { styles } from "@/app/styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "@/components/ui/toast";

export function SigninForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // show password
  function revealPassword() {
    setShowPassword(!showPassword);
  }

  async function onSubmit(value: z.infer<typeof formSchema>) {
    setLoading(true);
    await signIn.email(
      {
        email: value.email,
        password: value.password,
      },
      {
        onSuccess: (data) => {
          setLoading(false);
          form.reset();
          console.log(data);
          router.push("/");
        },
        onError: async (ctx) => {
          setLoading(false);
          form.reset();
          toast.add({
            type: "error",
            description: ctx.error.message,
          });
        },
      },
    );
  }

  const isValid = form.formState.isValid;
  return (
    <Card className="gap-3 py-7 shadow-[0_12px_32px_rgba(23,25,28,0.06)]">
      <CardHeader className="px-7">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Sign in to your account
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6">
        <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signin-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="signin-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="you@company.com"
                    autoComplete="on"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signin-form-password">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      id="signin-form-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {/* button to show/hide password */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={revealPassword}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute inset-y-0 right-1 my-auto text-muted-foreground active:not-aria-[haspopup]:translate-y-0"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              form="signin-form"
              disabled={loading || !isValid}
              className={`h-10 w-full cursor-pointer ${styles.primaryBgColor} ${styles.primaryHoverBgColor}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Logging…
                </>
              ) : (
                "Sign in to your account"
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t px-7">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className={`font-medium underline-offset-4 hover:underline ${styles.primaryTextColor}`}
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
