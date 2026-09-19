"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { styles } from "@/app/styles";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  workspace_name: z
    .string()
    .min(5, "Workspace name must be at least 5 characters.")
    .max(32, "Workspace name must be at most 32 characters."),
});

const OnboardingForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspace_name: "",
    },
  });
  async function onSubmit(value: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workspace_name: value.workspace_name }),
      });
      const data = await response.json();
      console.log(data);
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Card className="gap-3 py-7 max-w-2xl w-full shadow-lg ">
        <CardHeader className="px-7">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Create your workspace
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6">
          <form id="workspace-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="workspace_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-form-full-name">
                      Workspace name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-form-full-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Hatmann GmbH"
                      autoComplete="on"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                form="workspace-form"
                disabled={loading}
                className={`h-10 w-full cursor-pointer ${styles.primaryBgColor} ${styles.primaryHoverBgColor}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Creating workspace...
                  </>
                ) : (
                  "Create workspace"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
