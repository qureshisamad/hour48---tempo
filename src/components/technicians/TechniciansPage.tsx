import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase.ts";
import TechnicianGrid from "./TechnicianGrid";
import { TechnicianProps } from "./TechnicianCard";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import TopNavigation from "../dashboard/layout/TopNavigation";

export default function TechniciansPage() {
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState<TechnicianProps[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        // Fetch technicians with their specialties
        const { data: techniciansData, error: techniciansError } =
          await supabase.from("technicians").select("*");

        if (techniciansError) throw techniciansError;

        // For each technician, fetch their specialties
        const techsWithSpecialties = await Promise.all(
          (techniciansData || []).map(async (tech) => {
            const { data: specialtiesData } = await supabase
              .from("technician_specialties")
              .select("specialty_id")
              .eq("technician_id", tech.id);

            const specialtyIds =
              specialtiesData?.map((s) => s.specialty_id) || [];

            const { data: specialtyNames } = await supabase
              .from("specialties")
              .select("name")
              .in("id", specialtyIds);

            // Format the technician data to match TechnicianProps
            return {
              id: tech.id,
              name: tech.full_name,
              avatar:
                tech.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.full_name}`,
              rating: tech.rating || 0,
              reviewCount: tech.review_count || 0,
              location: tech.location || "Location not specified",
              specialties: specialtyNames?.map((s) => s.name) || [],
              experience: tech.experience || "Experience not specified",
              bio: tech.bio || "No bio available",
              available: tech.available || false,
              nextAvailable: tech.next_available || "Soon",
            };
          }),
        );

        setTechnicians(techsWithSpecialties);
      } catch (error) {
        console.error("Error fetching technicians:", error);
        toast({
          title: "Error",
          description: "Failed to load technicians. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [toast]);

  if (loading) {
    return <LoadingScreen text="Loading technicians..." />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-16">
      <TopNavigation />
      <TechnicianGrid technicians={technicians} />
    </div>
  );
}
