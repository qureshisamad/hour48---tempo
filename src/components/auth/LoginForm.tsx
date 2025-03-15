import { useState } from "react";
import { supabase } from "../../../supabase/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from "./AuthLayout";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password",
  );
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = location.state?.from || "/dashboard";

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate(from);
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
      toast({
        title: "Login Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/verify-otp`,
        },
      });

      if (error) throw error;

      toast({
        title: "Verification code sent",
        description: "Please check your email for the login code",
      });

      navigate("/verify-otp", {
        state: {
          email,
          from,
        },
      });
    } catch (error) {
      console.error("OTP login error:", error);
      setError((error as Error).message);
      toast({
        title: "Login Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium ${loginMethod === "password" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
              onClick={() => setLoginMethod("password")}
            >
              Password
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium ${loginMethod === "otp" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
              onClick={() => setLoginMethod("otp")}
            >
              Email OTP
            </button>
          </div>
        </div>

        {loginMethod === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOTPLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email-otp"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email-otp"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
            >
              {loading ? "Sending code..." : "Send login code"}
            </Button>
          </form>
        )}

        <div className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/user-type"
            state={{ from }}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
