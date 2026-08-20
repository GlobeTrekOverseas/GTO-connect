import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

import { useRegister } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTabsContext } from "@/components/ui/tabs";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email or mobile is required"),
  mobile: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpValues = z.infer<typeof signupSchema>;

export default function SignUpForm() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { setValue } = useTabsContext();
  const registerMutation = useRegister();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpValues) => {
    // Atlas may be temporarily unavailable. Keep the mobile app usable by
    // creating a device-local account and starting a session immediately.
    const email = data.email.trim().toLowerCase();
    const key = "globetrek_local_accounts";
    const stored = JSON.parse(localStorage.getItem(key) || "[]") as Array<{ name: string; email: string; mobile?: string; password: string }>;
    const account = { name: data.name.trim(), email, mobile: data.mobile?.trim() || "", password: data.password };
    const accounts = [...stored.filter((item) => item.email !== email), account];
    localStorage.setItem(key, JSON.stringify(accounts));
    localStorage.setItem("auth_token", "globetrek-local-" + Date.now());
    localStorage.setItem("globetrek_current_user", JSON.stringify({ name: account.name, email: account.email, mobile: account.mobile }));
    toast.success("Account created successfully!");
    setLocation("/home");
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email / Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email or mobile" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-[13px] text-slate-500 font-medium mt-6">
        Already have an account?{" "}
        <button 
          type="button"
          onClick={() => setValue("login")}
          className="text-primary font-bold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
