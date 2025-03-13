import { useState } from "react";
import TechnicianCard, { TechnicianProps } from "./TechnicianCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal } from "lucide-react";

interface TechnicianGridProps {
  technicians?: TechnicianProps[];
}

const defaultTechnicians: TechnicianProps[] = [
  {
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
    nextAvailable: "Tomorrow"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    rating: 4.8,
    reviewCount: 93,
    location: "Portland, OR",
    specialties: ["Air Ducts", "Dryer Vents", "Sanitization"],
    experience: "5+ years",
    bio: "Specialized in residential HVAC cleaning with a focus on improving indoor air quality.",
    available: true,
    nextAvailable: "Today"
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    rating: 4.7,
    reviewCount: 78,
    location: "Bellevue, WA",
    specialties: ["Furnace", "HVAC Maintenance", "Commercial"],
    experience: "10+ years",
    bio: "Expert in commercial HVAC systems with extensive experience in large building maintenance.",
    available: false,
    nextAvailable: "In 2 days"
  },
  {
    id: "4",
    name: "Emily Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    rating: 5.0,
    reviewCount: 42,
    location: "Tacoma, WA",
    specialties: ["Air Ducts", "Sanitization", "Residential"],
    experience: "3+ years",
    bio: "Dedicated to providing thorough cleaning services with a specialty in sanitization techniques.",
    available: true,
    nextAvailable: "Tomorrow"
  },
  {
    id: "5",
    name: "David Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 4.6,
    reviewCount: 112,
    location: "Everett, WA",
    specialties: ["Dryer Vents", "Furnace", "Emergency Services"],
    experience: "7+ years",
    bio: "Specializing in emergency HVAC services and preventative maintenance for residential systems.",
    available: false,
    nextAvailable: "Next week"
  },
  {
    id: "6",
    name: "Jessica Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    rating: 4.9,
    reviewCount: 67,
    location: "Redmond, WA",
    specialties: ["Air Ducts", "HVAC Maintenance", "Residential"],
    experience: "6+ years",
    bio: "Focused on providing comprehensive HVAC cleaning solutions for families and homeowners.",
    available: true,
    nextAvailable: "Today"
  }
];

export default function TechnicianGrid({ technicians = defaultTechnicians }: TechnicianGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState([4]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");

  // Filter technicians based on search and filters
  const filteredTechnicians = technicians.filter(tech => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Rating filter
    const matchesRating = tech.rating >= minRating[0];
    
    // Service filter
    const matchesService = selectedService === "" || 
      tech.specialties.some(s => s.toLowerCase() === selectedService.toLowerCase());
    
    // Availability filter
    const matchesAvailability = availabilityFilter === "" ||
      (availabilityFilter === "available" && tech.available) ||
      (availabilityFilter === "unavailable" && !tech.available);
    
    return matchesSearch && matchesRating && matchesService && matchesAvailability;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Find a Technician</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by name, location, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-lg"
            />
          </div>
          <Button 
            variant="outline" 
            className="h-12 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </Button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={minRating}
                  min={1}
                  max={5}
                  step={0.5}
                  onValueChange={setMinRating}
                  className="flex-1"
                />
                <span className="text-sm font-medium bg-white px-2 py-1 rounded border">{minRating[0]}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Services</SelectItem>
                  <SelectItem value="air ducts">Air Ducts</SelectItem>
                  <SelectItem value="furnace">Furnace</SelectItem>
                  <SelectItem value="dryer vents">Dryer Vents</SelectItem>
                  <SelectItem value="hvac maintenance">HVAC Maintenance</SelectItem>
                  <SelectItem value="sanitization">Sanitization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="h-10 rounded-lg">
                  <SelectValue placeholder="Any Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Availability</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                  <SelectItem value="unavailable">Schedule Later</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <p className="text-gray-600">{filteredTechnicians.length} technicians found</p>
          <Select defaultValue="rating">
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="experience">Most Experience</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTechnicians.map((technician) => (
          <TechnicianCard key={technician.id} {...technician} />
        ))}
      </div>
      
      {filteredTechnicians.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No technicians found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters to find available technicians.</p>
          <Button 
            variant="outline" 
            className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={() => {
              setSearchTerm("");
              setMinRating([4]);
              setSelectedService("