import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function AuthSetup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const { toast } = useToast();

  const setupAuthRedirects = async () => {
    setLoading(true);
    try {
      const { data, error } =
        await supabase.functions.invoke("auth-redirect-urls");

      if (error) throw error;

      setResult(JSON.stringify(data, null, 2));
      toast({
        title: "Auth Setup Complete",
        description: "Redirect URLs have been configured successfully.",
      });
    } catch (error) {
      console.error("Auth setup error:", error);
      setResult(`Error: ${(error as Error).message}`);
      toast({
        title: "Setup Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm mt-4">
      <h2 className="text-lg font-semibold mb-4">Auth Configuration</h2>
      <p className="text-sm text-gray-600 mb-4">
        If you're having trouble with authentication on localhost, click the
        button below to configure redirect URLs.
      </p>
      <Button onClick={setupAuthRedirects} disabled={loading} className="mb-4">
        {loading ? "Configuring..." : "Setup Auth Redirects"}
      </Button>

      {result && (
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40 text-xs">
          {result}
        </pre>
      )}
    </div>
  );
}
