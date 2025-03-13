import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  CreditCard,
  Home,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { useToast } from "@/components/ui/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

interface Technician {
  id: string;
  full_name: string;
  avatar: string;
  rating: number;
  location: string;
  specialties: string[];
  experience: string;
  available: boolean;
  next_available: string;
}

interface BookingWizardProps {
  selectedTechnicianId?: string;
  selectedServiceId?: string;
}

export default function BookingWizard({
  selectedTechnicianId,
  selectedServiceId,
}: BookingWizardProps) {
  const [activeStep, setActiveStep] = useState("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch services and technicians on component mount
  useState(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*");

        if (servicesError) throw servicesError;
        setServices(servicesData || []);

        // If selectedServiceId is provided, set the selected service
        if (selectedServiceId && servicesData) {
          const service = servicesData.find((s) => s.id === selectedServiceId);
          if (service) {
            setSelectedService(service);
            setActiveStep("technician");
          }
        }

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

            return {
              ...tech,
              specialties: specialtyNames?.map((s) => s.name) || [],
            };
          }),
        );

        setTechnicians(techsWithSpecialties || []);

        // If selectedTechnicianId is provided, set the selected technician
        if (selectedTechnicianId && techsWithSpecialties) {
          const technician = techsWithSpecialties.find(
            (t) => t.id === selectedTechnicianId,
          );
          if (technician) {
            setSelectedTechnician(technician);
            if (selectedService) {
              setActiveStep("datetime");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description:
            "Failed to load services and technicians. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setActiveStep("technician");
  };

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
    setActiveStep("datetime");
  };

  const handleDateTimeNext = () => {
    if (!date || !timeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time slot.",
        variant: "destructive",
      });
      return;
    }
    setActiveStep("details");
  };

  const handleSubmitBooking = async () => {
    if (
      !user ||
      !selectedService ||
      !selectedTechnician ||
      !date ||
      !timeSlot
    ) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get client id from user id
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (clientError) {
        // If client doesn't exist, create one
        const { data: newClient, error: createError } = await supabase
          .from("clients")
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || "Client",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          })
          .select("id")
          .single();

        if (createError) throw createError;

        // Create booking with new client id
        const { error: bookingError } = await supabase.from("bookings").insert({
          client_id: newClient.id,
          technician_id: selectedTechnician.id,
          service_id: selectedService.id,
          booking_date: format(date, "yyyy-MM-dd"),
          booking_time: timeSlot,
          status: "pending",
          notes: notes,
        });

        if (bookingError) throw bookingError;
      } else {
        // Create booking with existing client id
        const { error: bookingError } = await supabase.from("bookings").insert({
          client_id: clientData.id,
          technician_id: selectedTechnician.id,
          service_id: selectedService.id,
          booking_date: format(date, "yyyy-MM-dd"),
          booking_time: timeSlot,
          status: "pending",
          notes: notes,
        });

        if (bookingError) throw bookingError;
      }

      // Redirect to success page
      navigate("/success");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description:
          "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots from 8am to 5pm
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Book Your HVAC Service
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeStep} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger
                value="service"
                className={cn(
                  "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700",
                  activeStep === "service" ||
                    activeStep === "technician" ||
                    activeStep === "datetime" ||
                    activeStep === "details"
                    ? "text-blue-700"
                    : "",
                )}
                disabled
              >
                1. Service
              </TabsTrigger>
              <TabsTrigger
                value="technician"
                className={cn(
                  "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700",
                  activeStep === "technician" ||
                    activeStep === "datetime" ||
                    activeStep === "details"
                    ? "text-blue-700"
                    : "",
                )}
                disabled
              >
                2. Technician
              </TabsTrigger>
              <TabsTrigger
                value="datetime"
                className={cn(
                  "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700",
                  activeStep === "datetime" || activeStep === "details"
                    ? "text-blue-700"
                    : "",
                )}
                disabled
              >
                3. Date & Time
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className={cn(
                  "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700",
                  activeStep === "details" ? "text-blue-700" : "",
                )}
                disabled
              >
                4. Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="service" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Select a Service</h3>
                <div className="grid gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={cn(
                        "border rounded-xl p-4 cursor-pointer transition-all",
                        selectedService?.id === service.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200",
                      )}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg mb-2">
                            {service.name}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            {service.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            ${service.price}
                          </div>
                          {selectedService?.id === service.id && (
                            <CheckCircle className="h-5 w-5 text-blue-500 ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => selectedService && setActiveStep("technician")}
                  disabled={!selectedService}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
                >
                  Continue
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="technician" className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Select a Technician</h3>
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep("service")}
                    className="text-sm border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Back to Services
                  </Button>
                </div>

                <div className="grid gap-4">
                  {technicians.map((technician) => (
                    <div
                      key={technician.id}
                      className={cn(
                        "border rounded-xl p-4 cursor-pointer transition-all",
                        selectedTechnician?.id === technician.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200",
                      )}
                      onClick={() => handleTechnicianSelect(technician)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-gray-100">
                          <img
                            src={
                              technician.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${technician.full_name}`
                            }
                            alt={technician.full_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-lg">
                              {technician.full_name}
                            </h4>
                            {selectedTechnician?.id === technician.id && (
                              <CheckCircle className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>
                              {technician.location || "Location not specified"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {technician.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm text-gray-600">
                            {technician.experience ||
                              "Experience not specified"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600 mb-1">
                            {technician.available
                              ? "Available Now"
                              : `Available ${technician.next_available}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() =>
                    selectedTechnician && setActiveStep("datetime")
                  }
                  disabled={!selectedTechnician}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
                >
                  Continue
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="datetime" className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Select Date & Time</h3>
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep("technician")}
                    className="text-sm border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Back to Technicians
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Select a Date
                    </Label>
                    <div className="border rounded-xl p-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => {
                              // Disable dates in the past
                              return (
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              );
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Select a Time Slot
                    </Label>
                    <div className="border rounded-xl p-4">
                      <RadioGroup
                        value={timeSlot}
                        onValueChange={setTimeSlot}
                        className="grid grid-cols-2 gap-2"
                      >
                        {timeSlots.map((slot) => (
                          <div
                            key={slot}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={slot} id={`time-${slot}`} />
                            <Label
                              htmlFor={`time-${slot}`}
                              className="cursor-pointer"
                            >
                              {slot}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleDateTimeNext}
                  disabled={!date || !timeSlot}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
                >
                  Continue
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Booking Details</h3>
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep("datetime")}
                    className="text-sm border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Back to Date & Time
                  </Button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="font-medium mb-4">Booking Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">
                        {selectedService?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Technician:</span>
                      <span className="font-medium">
                        {selectedTechnician?.full_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {date ? format(date, "PPP") : "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">
                        {selectedService?.duration}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-900 font-medium">Total:</span>
                      <span className="text-gray-900 font-semibold">
                        ${selectedService?.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="address"
                      className="text-sm font-medium text-gray-700"
                    >
                      Service Address
                    </Label>
                    <div className="flex items-center mt-1">
                      <Home className="h-5 w-5 text-gray-400 mr-2" />
                      <Input
                        id="address"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="notes"
                      className="text-sm font-medium text-gray-700"
                    >
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions or details about your service needs"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 h-24"
                    />
                  </div>

                  <div className="pt-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Payment Method
                    </Label>
                    <div className="mt-1 border rounded-lg p-4 flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <span>Pay on service completion</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Payment will be collected after the service is completed
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitBooking}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
