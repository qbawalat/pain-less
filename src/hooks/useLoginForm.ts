import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/types/auth";
import { authService } from "@/services/auth";

export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      await authService.login(data);
      toast.success("Successfully signed in!");

      // Small delay to ensure cookie is set
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
}
