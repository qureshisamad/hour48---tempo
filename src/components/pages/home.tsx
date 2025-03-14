import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Settings,
  User,
  Clock,
  Star,
  Calendar,
  Shield,
  Fan,
  Wind,
  Thermometer,
  Wrench,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.9)] backdrop-blur-md border-b border-[#f0f4f8]/50">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-2xl text-blue-600">
              Hour<span className="text-blue-900">48</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Services
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Technicians
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-blue-600"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 hover:cursor-pointer border-2 border-blue-100">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/user-type">
                  <Button className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm px-4 shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
          <div className="absolute inset-0 bg-grid-blue-100/50 bg-[length:20px_20px] opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-full">
                Professional HVAC Cleaning
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Clean Air, <span className="text-blue-600">Healthy Home</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Connect with certified HVAC cleaning technicians in your area.
                Book appointments in minutes, not days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/services">
                  <Button className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 text-base font-medium shadow-md">
                    Book a Service
                  </Button>
                </Link>
                <Link to="/technicians">
                  <Button
                    variant="outline"
                    className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-6 text-base font-medium"
                  >
                    View Our Technicians
                  </Button>
                </Link>
              </div>
              <div className="flex items-center mt-8 text-sm text-gray-500">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="h-7 w-7 border-2 border-white">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        U{i}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span>
                  Trusted by <strong>2,000+</strong> homeowners
                </span>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"
                  alt="HVAC Technician"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center text-white">
                    <div className="flex items-center mr-4">
                      <Star
                        className="h-4 w-4 text-yellow-400 mr-1"
                        fill="currentColor"
                      />
                      <Star
                        className="h-4 w-4 text-yellow-400 mr-1"
                        fill="currentColor"
                      />
                      <Star
                        className="h-4 w-4 text-yellow-400 mr-1"
                        fill="currentColor"
                      />
                      <Star
                        className="h-4 w-4 text-yellow-400 mr-1"
                        fill="currentColor"
                      />
                      <Star
                        className="h-4 w-4 text-yellow-400 mr-1"
                        fill="currentColor"
                      />
                    </div>
                    <span className="text-sm font-medium">
                      5.0 (128 reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">
                  48-hour service guarantee
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Hour48 Works
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Get your HVAC system professionally cleaned in three simple steps
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-2xl relative">
                <div className="absolute -top-4 -left-4 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Book a Service</h3>
                <p className="text-gray-600">
                  Select your service type, preferred date, and time. Our
                  booking system makes scheduling effortless.
                </p>
              </div>
              <div className="bg-blue-50 p-8 rounded-2xl relative">
                <div className="absolute -top-4 -left-4 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Meet Your Technician
                </h3>
                <p className="text-gray-600">
                  A certified HVAC cleaning professional will arrive at your
                  scheduled time, ready to improve your air quality.
                </p>
              </div>
              <div className="bg-blue-50 p-8 rounded-2xl relative">
                <div className="absolute -top-4 -left-4 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enjoy Clean Air</h3>
                <p className="text-gray-600">
                  After the service, breathe easier knowing your HVAC system is
                  clean and operating efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our HVAC Cleaning Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive solutions for all your HVAC cleaning needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Fan className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Air Duct Cleaning
                </h3>
                <p className="text-gray-600 mb-4">
                  Remove dust, allergens, and contaminants from your air ducts
                  to improve indoor air quality.
                </p>
                <Link
                  to="/"
                  className="text-blue-600 font-medium flex items-center hover:underline"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Wind className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Dryer Vent Cleaning
                </h3>
                <p className="text-gray-600 mb-4">
                  Prevent fire hazards and improve dryer efficiency with
                  professional vent cleaning.
                </p>
                <Link
                  to="/"
                  className="text-blue-600 font-medium flex items-center hover:underline"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Thermometer className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">HVAC Maintenance</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive maintenance to ensure your HVAC system runs
                  efficiently year-round.
                </p>
                <Link
                  to="/"
                  className="text-blue-600 font-medium flex items-center hover:underline"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Wrench className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Furnace Cleaning</h3>
                <p className="text-gray-600 mb-4">
                  Thorough cleaning of your furnace components to improve
                  heating efficiency and safety.
                </p>
                <Link
                  to="/"
                  className="text-blue-600 font-medium flex items-center hover:underline"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Sanitization Services
                </h3>
                <p className="text-gray-600 mb-4">
                  Eliminate bacteria, viruses, and mold from your HVAC system
                  with our sanitization services.
                </p>
                <Link
                  to="/"
                  className="text-blue-600 font-medium flex items-center hover:underline"
                >
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl shadow-md text-white">
                <h3 className="text-xl font-semibold mb-3">
                  Not sure what you need?
                </h3>
                <p className="mb-4 opacity-90">
                  Our experts can help determine the right service for your
                  home's specific needs.
                </p>
                <Link to="/user-type">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-lg">
                    Schedule a Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Technician profiles preview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Certified Technicians
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Skilled professionals ready to provide exceptional service
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={`https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80`}
                      alt={`Technician ${i}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded-full">
                        Available
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold">John Technician</h3>
                      <div className="flex items-center">
                        <Star
                          className="h-4 w-4 text-yellow-400"
                          fill="currentColor"
                        />
                        <span className="ml-1 text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      HVAC Specialist with 8+ years of experience in residential
                      and commercial systems.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-full">
                        Air Ducts
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-full">
                        Furnace
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 rounded-full">
                        Maintenance
                      </Badge>
                    </div>
                    <Link to="/">
                      <Button className="w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/technicians">
                <Button
                  variant="outline"
                  className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 px-6 py-2"
                >
                  View All Technicians
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real feedback from satisfied homeowners
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 text-yellow-400 mr-1"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "The technician was professional, thorough, and explained
                    everything. My HVAC system is running better than ever, and
                    the air quality in my home has noticeably improved."
                  </p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 border-2 border-blue-100">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=customer${i}`}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        C{i}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Sarah Johnson</h4>
                      <p className="text-sm text-gray-500">
                        Homeowner in Seattle
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Cleaner, Healthier Air?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Book your HVAC cleaning service today and breathe easier tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button className="rounded-lg bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-base font-medium shadow-md">
                  Book a Service
                </Button>
              </Link>
              <Link to="/technicians">
                <Button
                  variant="outline"
                  className="rounded-lg border-white text-white hover:bg-blue-700 px-8 py-6 text-base font-medium"
                >
                  View Technicians
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Hour<span className="text-blue-400">48</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Professional HVAC cleaning services delivered within 48 hours.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Air Duct Cleaning
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Dryer Vent Cleaning
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    HVAC Maintenance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Furnace Cleaning
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Sanitization Services
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Our Technicians
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Service Guarantee
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-sm text-gray-400">
            <p>© 2024 Hour48 HVAC Cleaning Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
