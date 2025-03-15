import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Star, ThumbsUp } from "lucide-react";
import { supabase } from "../../../supabase/supabase.ts";
import { useAuth } from "../../../supabase/auth.tsx";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import ReviewForm from "../reviews/ReviewForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string;
  technician: {
    id: string;
    full_name: string;
    avatar: string;
    location: string;
  };
  service: {
    id: string;
    name: string;
    price: number;
    duration: string;
  };
  client: {
    id: string;
  };
}

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        // Get client id from user id
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (clientError) {
          // If client doesn't exist yet, create one
          if (clientError.code === "PGRST116") {
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

            // No bookings yet for new client
            setBookings([]);
            setLoading(false);
            return;
          }
          throw clientError;
        }

        // Fetch bookings with technician and service details
        const { data, error } = await supabase
          .from("bookings")
          .select(
            `
            id,
            booking_date,
            booking_time,
            status,
            notes,
            technician:technician_id(id, full_name, avatar, location),
            service:service_id(id, name, price, duration),
            client:client_id(id)
          `,
          )
          .eq("client_id", clientData.id)
          .order("booking_date", { ascending: false });

        if (error) throw error;

        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Confirmed
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      case "reviewed":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Reviewed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;

      // Update local state
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking,
        ),
      );

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openReviewDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    setReviewDialogOpen(false);
    // Update local state
    if (selectedBooking) {
      setBookings(
        bookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, status: "reviewed" }
            : booking,
        ),
      );
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === "upcoming") {
      return bookingDate >= today && booking.status !== "cancelled";
    } else if (activeTab === "past") {
      return (
        bookingDate < today ||
        booking.status === "completed" ||
        booking.status === "reviewed"
      );
    } else {
      // all
      return true;
    }
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My Bookings</h2>
        <p className="text-gray-600">Manage your HVAC service appointments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <Card className="border border-gray-100 rounded-xl shadow-sm">
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-600 mb-4">
                  No {activeTab} bookings found
                </p>
                <Button
                  onClick={() => navigate("/technicians")}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Book a Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">
                        {format(new Date(booking.booking_date), "MMMM d, yyyy")}{" "}
                        at {booking.booking_time}
                      </span>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border-2 border-gray-100">
                        <AvatarImage
                          src={
                            booking.technician.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.technician.full_name}`
                          }
                          alt={booking.technician.full_name}
                        />
                        <AvatarFallback>
                          {booking.technician.full_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-lg">
                          {booking.service.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{booking.service.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>
                            Technician: {booking.technician.full_name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                      <div className="text-lg font-semibold text-gray-900">
                        ${booking.service.price}
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <Button
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 text-sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}

                        {booking.status === "completed" && (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            onClick={() => openReviewDialog(booking)}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Leave Review
                          </Button>
                        )}

                        {booking.status === "reviewed" && (
                          <Button
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50 text-sm"
                            disabled
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Reviewed
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </h4>
                      <p className="text-sm text-gray-600">{booking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <ReviewForm
              bookingId={selectedBooking.id}
              technicianId={selectedBooking.technician.id}
              clientId={selectedBooking.client.id}
              onSuccess={handleReviewSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
