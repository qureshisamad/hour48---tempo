import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Star,
  ThumbsUp,
  User,
} from "lucide-react";
import { TechnicianProps } from "./TechnicianCard";

interface ReviewProps {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  service: string;
}

const defaultReviews: ReviewProps[] = [
  {
    id: "1",
    author: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    date: "2 weeks ago",
    rating: 5,
    comment:
      "John did an amazing job cleaning our air ducts. He was thorough, professional, and explained everything he was doing. Our air quality has improved significantly!",
    service: "Air Duct Cleaning",
  },
  {
    id: "2",
    author: "Michael Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    date: "1 month ago",
    rating: 4,
    comment:
      "Very professional service. Arrived on time and completed the job efficiently. Would recommend for furnace maintenance.",
    service: "Furnace Cleaning",
  },
  {
    id: "3",
    author: "Emily Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    date: "2 months ago",
    rating: 5,
    comment:
      "Excellent service! John was knowledgeable and took the time to answer all my questions. My HVAC system is running much better now.",
    service: "HVAC Maintenance",
  },
];

interface TechnicianProfileProps {
  technician?: TechnicianProps;
  reviews?: ReviewProps[];
}

const defaultTechnician: TechnicianProps = {
  id: "1",
  name: "John Smith",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  rating: 4.9,
  reviewCount: 127,
  location: "Seattle, WA",
  specialties: [
    "Air Ducts",
    "Furnace",
    "Maintenance",
    "Dryer Vents",
    "Sanitization",
  ],
  experience: "8+ years",
  bio: "HVAC Specialist with 8+ years of experience in residential and commercial systems. Certified in all aspects of HVAC cleaning and maintenance.",
  available: true,
  nextAvailable: "Tomorrow",
};

export default function TechnicianProfile({
  technician = defaultTechnician,
  reviews = defaultReviews,
}: TechnicianProfileProps) {
  // Calculate rating distribution
  const ratingDistribution = {
    5: 75,
    4: 20,
    3: 3,
    2: 1,
    1: 1,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Technician info */}
        <div className="lg:col-span-1">
          <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-20">
            <div className="aspect-video relative bg-blue-50">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80"
                alt={`Technician ${technician.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{technician.name}</h2>
                <Badge
                  className={`${technician.available ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} hover:bg-green-100 px-2 py-1 rounded-full`}
                >
                  {technician.available
                    ? "Available Now"
                    : `Available ${technician.nextAvailable}`}
                </Badge>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex items-center mr-3">
                  <Star
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                  />
                  <span className="ml-1 font-medium">{technician.rating}</span>
                </div>
                <span className="text-sm text-gray-500">
                  ({technician.reviewCount} reviews)
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{technician.location}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <User className="h-5 w-5 mr-2" />
                <span>{technician.experience} experience</span>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {technician.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-gray-600">{technician.bio}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Certifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>NADCA Certified Technician</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>EPA 608 Certification</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                    <span>HVAC Excellence Certification</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs for reviews, services, etc. */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="reviews" className="text-sm">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="services" className="text-sm">
                Services
              </TabsTrigger>
              <TabsTrigger value="availability" className="text-sm">
                Availability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-8">
              <Card className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Customer Reviews
                  </h3>

                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="md:w-1/3 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {technician.rating}
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {technician.reviewCount} reviews
                      </div>
                    </div>

                    <div className="md:w-2/3">
                      <h4 className="font-medium mb-3">Rating Distribution</h4>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center mb-2">
                          <div className="flex items-center w-16">
                            <span className="text-sm font-medium mr-2">
                              {rating}
                            </span>
                            <Star
                              className="h-4 w-4 text-yellow-400"
                              fill="currentColor"
                            />
                          </div>
                          <div className="flex-1 mx-2">
                            <Progress
                              value={
                                ratingDistribution[
                                  rating as keyof typeof ratingDistribution
                                ]
                              }
                              className="h-2"
                            />
                          </div>
                          <div className="w-12 text-right text-sm text-gray-500">
                            {
                              ratingDistribution[
                                rating as keyof typeof ratingDistribution
                              ]
                            }
                            %
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-t border-gray-100 pt-6"
                      >
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage
                              src={review.avatar}
                              alt={review.author}
                            />
                            <AvatarFallback>{review.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{review.author}</h4>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                                  fill="currentColor"
                                />
                              ))}
                              <Badge className="ml-3 bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-full">
                                {review.service}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">
                              {review.comment}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-gray-500 hover:text-blue-600"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-gray-500 hover:text-blue-600"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Load More Reviews
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">
                    Services Offered
                  </h3>

                  <div className="space-y-6">
                    <div className="border border-gray-100 rounded-xl p-5 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg mb-2">
                            Air Duct Cleaning
                          </h4>
                          <p className="text-gray-600 mb-3">
                            Complete cleaning of your home's air duct system to
                            remove dust, allergens, and contaminants.
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>3-4 hours</span>
                            <Shield className="h-4 w-4 ml-4 mr-1 text-blue-600" />
                            <span className="text-blue-600">
                              Satisfaction Guaranteed
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            $299
                          </div>
                          <Button className="rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-5 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg mb-2">
                            Dryer Vent Cleaning
                          </h4>
                          <p className="text-gray-600 mb-3">
                            Thorough cleaning of your dryer vent to improve
                            efficiency and reduce fire hazards.
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>1-2 hours</span>
                            <Shield className="h-4 w-4 ml-4 mr-1 text-blue-600" />
                            <span className="text-blue-600">
                              Satisfaction Guaranteed
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            $149
                          </div>
                          <Button className="rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-5 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg mb-2">
                            HVAC System Maintenance
                          </h4>
                          <p className="text-gray-600 mb-3">
                            Comprehensive maintenance service to ensure your
                            HVAC system runs efficiently year-round.
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>2-3 hours</span>
                            <Shield className="h-4 w-4 ml-4 mr-1 text-blue-600" />
                            <span className="text-blue-600">
                              Satisfaction Guaranteed
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            $199
                          </div>
                          <Button className="rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-xl p-5 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-lg mb-2">
                            Furnace Cleaning
                          </h4>
                          <p className="text-gray-600 mb-3">
                            Thorough cleaning of your furnace components to
                            improve heating efficiency and safety.
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>2-3 hours</span>
                            <Shield className="h-4 w-4 ml-4 mr-1 text-blue-600" />
                            <span className="text-blue-600">
                              Satisfaction Guaranteed
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            $179
                          </div>
                          <Button className="rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-6">
              <Card className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">
                    Availability Calendar
                  </h3>

                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      {technician.name} is currently available for bookings.
                      Select a date and time below to schedule your service.
                    </p>
                    <div className="flex items-center mb-4 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-blue-700 font-medium">
                        Next available appointment: Tomorrow at 9:00 AM
                      </span>
                    </div>
                  </div>

                  <div className="border border-gray-100 rounded-xl p-5">
                    <h4 className="font-medium mb-4">Weekly Availability</h4>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center font-medium text-sm"
                          >
                            {day}
                          </div>
                        ),
                      )}
                      {[
                        "8am-5pm",
                        "8am-5pm",
                        "8am-5pm",
                        "8am-5pm",
                        "8am-5pm",
                        "9am-2pm",
                        "Closed",
                      ].map((hours, i) => (
                        <div
                          key={i}
                          className={`text-center text-sm p-2 rounded ${hours === "Closed" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-700"}`}
                        >
                          {hours}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      * Hours may vary on holidays
                    </p>
                  </div>

                  <div className="mt-6 text-center">
                    <Button className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 px-8">
                      Check Detailed Availability
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
