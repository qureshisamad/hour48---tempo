import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../../../supabase/supabase";

export default function CorsTest() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testCors = async () => {
    setLoading(true);
    try {
      // Test the CORS function
      const { data, error } = await supabase.functions.invoke("cors");

      if (error) throw error;

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("CORS test error:", error);
      setResult(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">CORS Test</h2>
      <Button onClick={testCors} disabled={loading} className="mb-4">
        {loading ? "Testing..." : "Test CORS Connection"}
      </Button>

      {result && (
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40">
          {result}
        </pre>
      )}
    </div>
  );
}
