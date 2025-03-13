import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string;
  client: {
    id: string;
    full_name: string;
    avatar: string;
  };
  service: {
    id: string;
    name: string;
    price: number;
    duration: string;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client: {
    full_name: string;
    avatar: string;
  };
  service: {
    name: string;
  };
}

export default function TechnicianDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    averageRating: 0,
    reviewCount: 0,
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Get technician id from user id
        const { data: technicianData, error: technicianError } = await supabase
          .from("technicians")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (technicianError) {
          // If technician doesn't exist yet, create one
          if (technicianError.code === "PGRST116") {
            const { data: newTechnician, error: createError } = await supabase
              .from("technicians")
              .insert({
                user_id: user.id,
                full_name: user.user_metadata?.full_name || "Technician",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                rating: 0,
                review_count: 0,
                available: true,
              })
              .select("id")
              .single();

            if (createError) throw createError;

            // No bookings or reviews yet for new technician
            setBookings([]);
            setReviews([]);
            setStats({
              totalBookings: 0,
              completedBookings: 0,
              averageRating: 0,
              reviewCount: 0,
            });
            setLoading(false);
            return;
          }
          throw technicianError;
        }

        // Fetch bookings with client and service details
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select(
            `
            id,
            booking_date,
            booking_time,
            status,
            notes,
            client:client_id(id, full_name, avatar),
            service:service_id(id, name, price, duration)
          `,
          )
          .eq("technician_id", technicianData.id)
          .order("booking_date", { ascending: true });

        if (bookingsError) throw bookingsError;

        setBookings(bookingsData || []);

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(
            `
            id,
            rating,
            comment,
            created_at,
            client:client_id(full_name, avatar),
            booking:booking_id(service:service_id(name))
          `,
          )
          .eq("technician_id", technicianData.id)
          .order("created_at", { ascending: false });

        if (reviewsError) throw reviewsError;

        // Transform the data to match the Review interface
        const formattedReviews = (reviewsData || []).map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          client: review.client,
          service: { name: review.booking?.service?.name || "Unknown Service" },
        }));

        setReviews(formattedReviews);

        // Calculate stats
        const totalBookings = bookingsData?.length || 0;
        const completedBookings =
          bookingsData?.filter(
            (b) => b.status === "completed" || b.status === "reviewed",
          ).length || 0;
        const totalRating = formattedReviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        );
        const averageRating =
          formattedReviews.length > 0
            ? totalRating / formattedReviews.length
            : 0;

        setStats({
          totalBookings,
          completedBookings,
          averageRating,
          reviewCount: formattedReviews.length,
        });
      } catch (error) {
        console.error("Error fetching technician data:", error);
        toast({
          title: "Error",
          description: "Failed to load your dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: string,
  ) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      // Update local state
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: newStatus }
            : booking,
        ),
      );

      toast({
        title: "Status Updated",
        description: `Booking has been marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === "upcoming") {
      return (
        bookingDate >= today &&
        booking.status !== "cancelled" &&
        booking.status !== "completed" &&
        booking.status !== "reviewed"
      );
    } else if (activeTab === "completed") {
      return booking.status === "completed" || booking.status === "reviewed";
    } else {
      // all
      return true;
    }
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Technician Dashboard
        </h2>
        <p className="text-gray-600">
          Manage your appointments and view customer reviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-gray-100 rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-gray-900">
              {stats.totalBookings}
            </div>
            <p className="text-sm text-gray-500 mt-1">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-gray-900">
              {stats.completedBookings}
            </div>
            <p className="text-sm text-gray-500 mt-1">Completed Services</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-gray-900">
              {stats.averageRating.toFixed(1)}
              {stats.reviewCount > 0 && (
                <span className="text-sm text-gray-500 ml-1">
                  ({stats.reviewCount})
                </span>
              )}
            </div>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(stats.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">Average Rating</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="text-3xl font-semibold text-gray-900">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Pending Appointments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Bookings Tabs */}
        {activeTab !== "reviews" && (
          <TabsContent value={activeTab} className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <Card className="border border-gray-100 rounded-xl shadow-sm">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-gray-600">No {activeTab} bookings found</p>
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
                          {format(
                            new Date(booking.booking_date),
                            "MMMM d, yyyy",
                          )}{" "}
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
                              booking.client.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.client.full_name}`
                            }
                            alt={booking.client.full_name}
                          />
                          <AvatarFallback>
                            {booking.client.full_name[0]}
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
                            <span>Client: {booking.client.full_name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2">
                        <div className="text-lg font-semibold text-gray-900">
                          ${booking.service.price}
                        </div>
                        <div className="flex gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "confirmed",
                                  )
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 text-sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "cancelled",
                                  )
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}

                          {booking.status === "confirmed" && (
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white text-sm"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  booking.id,
                                  "completed",
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Completed
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
        )}

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : reviews.length === 0 ? (
            <Card className="border border-gray-100 rounded-xl shadow-sm">
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-600">No reviews yet</p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card
                key={review.id}
                className="border border-gray-100 rounded-xl shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 border-2 border-gray-100">
                      <AvatarImage
                        src={
                          review.client.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.client.full_name}`
                        }
                        alt={review.client.full_name}
                      />
                      <AvatarFallback>
                        {review.client.full_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {review.client.full_name}
                          </h3>
                          <div className="flex items-center mt-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                            <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-full">
                              {review.service.name}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(review.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
