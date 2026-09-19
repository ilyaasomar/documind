"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    full_name: z
      .string()
      .min(5, "Name must be at least 5 characters.")
      .max(32, "Name must be at most 32 characters."),
    work_email: z.email(),
    password: z.string().min(8, "Email must be at least 8 characters."),
    confirm_password: z
      .string()
      .min(8, "Confirm password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { signUp } from "@/lib/auth-client";
import { styles } from "@/app/styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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

export function SignupForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      work_email: "",
      password: "",
      confirm_password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // show password
  function revealPassword() {
    setShowPassword(!showPassword);
  }

  // show confirm password
  function revealConfirmPassword() {
    setShowConfirmPassword(!showConfirmPassword);
  }

  async function onSubmit(value: z.infer<typeof formSchema>) {
    setLoading(true);
    await signUp.email(
      {
        name: value.full_name,
        email: value.work_email,
        password: value.password,
      },
      {
        onSuccess: (data) => {
          setLoading(false);
          form.reset();
          router.push("/onboarding");
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
          Create your account
        </CardTitle>
        <CardDescription>
          Next you&apos;ll set up your workspace and invite your team.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6">
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="full_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-full-name">
                    Full name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-form-full-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ilyas Omar"
                    autoComplete="on"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="work_email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-work-email">
                    Work email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-form-work-email"
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
                  <FieldLabel htmlFor="signup-form-password">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      id="signup-form-password"
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

            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-confirm-password">
                    Confirm password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      id="signup-form-confirm-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      autoComplete="off"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={revealConfirmPassword}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      className="absolute inset-y-0 right-1 my-auto text-muted-foreground active:not-aria-[haspopup]:translate-y-0"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
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
              form="signup-form"
              className={`h-10 w-full cursor-pointer ${styles.primaryBgColor} ${styles.primaryHoverBgColor}`}
              disabled={loading || !isValid}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t px-7">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signin"
            className={`font-medium underline-offset-4 hover:underline ${styles.primaryTextColor}`}
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
