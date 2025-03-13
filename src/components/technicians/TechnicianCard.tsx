import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

export interface TechnicianProps {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  specialties: string[];
  experience: string;
  bio: string;
  available: boolean;
  nextAvailable?: string;
}

const defaultTechnician: TechnicianProps = {
  id: "1",
  name: "John Smith",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  rating: 4.9,
  reviewCount: 127,
  location: "Seattle, WA",
  specialties: ["Air Ducts", "Furnace", "Maintenance"],
  experience: "8+ years",
  bio: "HVAC Specialist with 8+ years of experience in residential and commercial systems.",
  available: true,
  nextAvailable: "Tomorrow",
};

export default function TechnicianCard({
  id = defaultTechnician.id,
  name = defaultTechnician.name,
  avatar = defaultTechnician.avatar,
  rating = defaultTechnician.rating,
  reviewCount = defaultTechnician.reviewCount,
  location = defaultTechnician.location,
  specialties = defaultTechnician.specialties,
  experience = defaultTechnician.experience,
  bio = defaultTechnician.bio,
  available = defaultTechnician.available,
  nextAvailable = defaultTechnician.nextAvailable,
}: Partial<TechnicianProps>) {
  return (
    <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] relative bg-blue-50">
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80"
          alt={`Technician ${name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge
            className={`${available ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} hover:bg-green-100 px-2 py-1 rounded-full`}
          >
            {available ? "Available Now" : `Available ${nextAvailable}`}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">{name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
            <span className="ml-1 text-sm font-medium">{rating}</span>
            <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <p className="text-gray-600 mb-4">{bio}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {specialties.map((specialty, index) => (
            <Badge
              key={index}
              className="bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-full"
            >
              {specialty}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{experience} experience</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/technicians/${id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              View Profile
            </Button>
          </Link>
          <Link to={`/book/${id}`} className="flex-1">
            <Button className="w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
