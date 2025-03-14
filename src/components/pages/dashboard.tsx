import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";
import ClientDashboard from "../dashboard/ClientDashboard";
import TechnicianDashboard from "../dashboard/TechnicianDashboard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { LoadingScreen } from "@/components/ui/loading-spinner";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<"client" | "technician" | null>(
    null,
  );
  const { user } = useAuth();

  useEffect(() => {
    const checkUserType = async () => {
      if (!user) return;

      try {
        // Check if user is a client
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (clientData) {
          setUserType("client");
          setLoading(false);
          return;
        }

        // Check if user is a technician
        const { data: technicianData, error: technicianError } = await supabase
          .from("technicians")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (technicianData) {
          setUserType("technician");
          setLoading(false);
          return;
        }

        // If user is neither, create a client profile by default
        if (!clientData && !technicianData) {
          const { data: newClient, error: createError } = await supabase
            .from("clients")
            .insert({
              user_id: user.id,
              full_name: user.user_metadata?.full_name || "Client",
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
            })
            .select("id")
            .single();

          if (newClient) {
            setUserType("client");
          }
        }
      } catch (error) {
        console.error("Error determining user type:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserType();
  }, [user]);

  // Function to trigger loading state for demonstration
  const handleRefresh = () => {
    setLoading(true);
    // Reset loading after 2 seconds
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  if (loading) {
    return <LoadingScreen text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 pt-4 pb-2 flex justify-end">
            <Button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh Dashboard"}
            </Button>
          </div>
          <div
            className={cn(
              "container mx-auto p-6 space-y-8",
              "transition-all duration-300 ease-in-out",
            )}
          >
            {userType === "client" ? (
              <ClientDashboard />
            ) : userType === "technician" ? (
              <TechnicianDashboard />
            ) : (
              <>
                <DashboardGrid isLoading={false} />
                <TaskBoard isLoading={false} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
