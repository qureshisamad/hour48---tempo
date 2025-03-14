import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export default function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("name");

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  if (loading) {
    return <LoadingScreen text="Loading services..." />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our HVAC Cleaning Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions for all your HVAC cleaning needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service.id}
              className="border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{service.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-gray-900">
                    ${service.price}
                  </div>
                  <Link to={`/book?service=${service.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
