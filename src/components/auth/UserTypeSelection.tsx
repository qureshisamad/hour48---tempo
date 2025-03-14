import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { User, Wrench } from "lucide-react";
import AuthLayout from "./AuthLayout";

export default function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<
    "client" | "technician" | null
  >(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleContinue = () => {
    if (selectedType === "client") {
      navigate("/signup", { state: { userType: "client", from } });
    } else if (selectedType === "technician") {
      navigate("/signup", { state: { userType: "technician", from } });
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Join as a Client or Technician
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Choose how you want to use Hour48 HVAC Cleaning Service Platform
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card
            className={`border cursor-pointer transition-all ${selectedType === "client" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"}`}
            onClick={() => setSelectedType("client")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">I'm a Client</h3>
              <p className="text-sm text-gray-600">
                Looking for HVAC cleaning services for my home or business
              </p>
            </CardContent>
          </Card>

          <Card
            className={`border cursor-pointer transition-all ${selectedType === "technician" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"}`}
            onClick={() => setSelectedType("technician")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">I'm a Technician</h3>
              <p className="text-sm text-gray-600">
                Offering professional HVAC cleaning services to clients
              </p>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
        >
          Continue
        </Button>

        <div className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            state={{ from }}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
