import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { SiApple } from "react-icons/si";
import { toast } from "sonner";
import { useLocation } from "wouter";

import { useLogin } from "@workspace/api-client-react";
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

const DEMO_EMAIL = "demo@gtoconnect.com";
const DEMO_PASSWORD = "Demo@1234";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or mobile is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.2 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.2 29.3 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.1 0 9.8-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.4-7.9L6 33.2C9.3 39.6 16.1 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.1 5-4.1 5.6l6.2 5.2C36.9 39.3 44 34 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export default function LoginForm() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);
  const { setValue } = useTabsContext();
  const loginMutation = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const fillDemo = () => {
    form.setValue("identifier", DEMO_EMAIL);
    form.setValue("password", DEMO_PASSWORD);
  };

  const onSubmit = (data: LoginValues) => {
    const identifier = data.identifier.trim().toLowerCase();
    const localAccounts = JSON.parse(localStorage.getItem("globetrek_local_accounts") || "[]") as Array<{ name: string; email: string; mobile?: string; password: string }>;
    const localAccount = localAccounts.find((account) => account.email === identifier && account.password === data.password);
    if (localAccount) {
      localStorage.setItem("auth_token", "globetrek-local-" + Date.now());
      localStorage.setItem("globetrek_current_user", JSON.stringify({ name: localAccount.name, email: localAccount.email, mobile: localAccount.mobile || "" }));
      toast.success("Welcome to GlobeTrek!");
      setLocation("/home");
      return;
    }

    if (identifier === DEMO_EMAIL && data.password === DEMO_PASSWORD) {
      localStorage.setItem("auth_token", "globetrek-demo-session");
      toast.success("Welcome to GlobeTrek!");
      setLocation("/home");
      return;
    }

    loginMutation.mutate(
      { data },
      {
        onSuccess: (response) => {
          localStorage.setItem("auth_token", response.token);
          toast.success("Login successful!");
          setLocation("/home");
        },
        onError: (error) => toast.error(error?.data?.error || "Failed to login. Please try again."),
      },
    );
  };

  const onSocialClick = () => toast.info("Coming soon!");

  return (
    <div className="flex w-full flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        type="button"
        onClick={fillDemo}
        className="mb-3 flex w-full items-center justify-between rounded-2xl border border-transparent bg-transparent px-4 py-2 text-left transition-colors hover:bg-[#edf8f1]"
      >
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-[.08em] text-[#087b41]">Demo account</span>
          <span className="mt-0.5 block text-[12px] font-medium text-slate-600">{DEMO_EMAIL}</span>
        </span>
        <span className="text-[11px] font-bold text-[#087b41]">Tap to fill</span>
      </button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px]">Email / Mobile Number</FormLabel>
                <div className="relative">
                  <Mail size={21} strokeWidth={1.9} className="gto-icon-blend pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
                  <FormControl>
                    <Input className="h-12 rounded-2xl border border-white/90 bg-white pl-12 text-[13px] text-slate-800 shadow-[0_7px_18px_rgba(11,54,99,.16)] placeholder:text-slate-400" placeholder="Enter your email or mobile" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px]">Password</FormLabel>
                <div className="relative">
                  <LockKeyhole size={21} strokeWidth={1.9} className="gto-icon-blend pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
                  <FormControl>
                    <Input
                      className="h-12 rounded-2xl border border-white/90 bg-white pl-12 pr-12 text-[13px] text-slate-800 shadow-[0_7px_18px_rgba(11,54,99,.16)] placeholder:text-slate-400"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="gto-icon-blend absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:opacity-100"
                  >
                    {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-1">
            <button
              type="button"
              className="text-[12px] font-bold text-[#087b41] transition-colors hover:text-[#065e31]"
              onClick={() => toast.info("Forgot password flow coming soon!")}
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            className="relative mt-2 h-12 w-full rounded-2xl bg-gradient-to-r from-[#006d39] via-[#087b41] to-[#006d39] text-[15px] font-bold shadow-[0_12px_24px_rgba(8,123,65,.30)] hover:from-[#056c39] hover:to-[#056c39]"
            disabled={loginMutation.isPending}
          >
            <span>{loginMutation.isPending ? "Logging in..." : "Login"}</span>
            {!loginMutation.isPending && <ArrowRight size={24} className="absolute right-5" strokeWidth={2.2} />}
          </Button>
        </form>
      </Form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300/70" /></div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-transparent px-4 font-medium text-slate-500">or continue with</span>
        </div>
      </div>

      <div className="mb-3 flex justify-center gap-4">
        <button type="button" onClick={onSocialClick} className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-white/28 shadow-[0_8px_18px_rgba(11,54,99,.14)] transition-transform hover:scale-105" aria-label="Google Login">
          <GoogleMark />
        </button>
        <button type="button" onClick={onSocialClick} className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-white/28 shadow-[0_5px_12px_rgba(11,54,99,.18)] text-black shadow-[0_8px_18px_rgba(11,54,99,.14)] transition-transform hover:scale-105" aria-label="Apple Login">
          <SiApple size={21} />
        </button>
      </div>

      <p className="text-center text-[12px] font-medium text-slate-600">
        Don't have an account?{" "}
        <button type="button" onClick={() => setValue("signup")} className="font-bold text-[#087b41] hover:underline">
          Sign Up
        </button>
      </p>
    </div>
  );
}
