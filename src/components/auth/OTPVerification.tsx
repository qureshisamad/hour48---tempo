import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from "./AuthLayout";
import { supabase } from "../../../supabase/supabase";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const email = location.state?.email || "";
  const userType = location.state?.userType || "client";
  const fullName = location.state?.fullName || "";

  useEffect(() => {
    if (!email) {
      navigate("/signup");
      return;
    }

    let timer: number;
    if (countdown > 0 && !canResend) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, canResend, email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (error) throw error;

      // Create the appropriate profile based on user type
      if (userType === "technician") {
        const { error: techError } = await supabase.from("technicians").insert({
          user_id: (await supabase.auth.getUser()).data.user?.id || "",
          full_name: fullName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          rating: 0,
          review_count: 0,
          available: true,
          next_available: "Tomorrow",
        });
        if (techError) throw techError;
      } else {
        const { error: clientError } = await supabase.from("clients").insert({
          user_id: (await supabase.auth.getUser()).data.user?.id || "",
          full_name: fullName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        });
        if (clientError) throw clientError;
      }

      toast({
        title: "Verification successful",
        description: "Your account has been verified",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      setCountdown(60);
      setCanResend(false);

      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email",
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast({
        title: "Failed to resend OTP",
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
        <h2 className="text-2xl font-semibold text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          We've sent a verification code to{" "}
          <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Verification Code
            </Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              required
              className="h-12 rounded-lg text-center text-lg tracking-widest font-medium"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="text-center">
            {canResend ? (
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800"
              >
                Resend verification code
              </Button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend code in {countdown} seconds
              </p>
            )}
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
