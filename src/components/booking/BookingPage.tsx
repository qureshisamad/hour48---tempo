import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingWizard from "./BookingWizard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../../supabase/auth";
import { LoadingScreen } from "@/components/ui/loading-spinner";

export default function BookingPage() {
  const { technicianId, serviceId } = useParams();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate("/login", { state: { from: `/book/${technicianId || ""}` } });
      return;
    }
    setLoading(false);
  }, [user, navigate, technicianId]);

  if (loading) {
    return <LoadingScreen text="Loading booking page..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <BookingWizard
          selectedTechnicianId={technicianId}
          selectedServiceId={serviceId}
        />
      </div>
    </div>
  );
}
