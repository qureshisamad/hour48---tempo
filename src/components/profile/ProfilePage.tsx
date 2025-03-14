import { useState, useEffect } from "react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Phone, Mail, User, Calendar, Briefcase } from "lucide-react";

interface ProfileData {
  id: string;
  full_name: string;
  avatar: string;
  phone: string;
  address: string;
  bio?: string;
  location?: string;
  experience?: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userType, setUserType] = useState<"client" | "technician" | null>(
    null,
  );
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        // Check if user is a client
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (clientData) {
          setUserType("client");
          setProfileData(clientData);
          setFormData(clientData);
          setLoading(false);
          return;
        }

        // Check if user is a technician
        const { data: technicianData, error: technicianError } = await supabase
          .from("technicians")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (technicianData) {
          setUserType("technician");
          setProfileData(technicianData);
          setFormData(technicianData);
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
              phone: "",
              address: "",
            })
            .select("*")
            .single();

          if (newClient) {
            setUserType("client");
            setProfileData(newClient);
            setFormData(newClient);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user || !userType || !profileData?.id) return;

    setSaving(true);
    try {
      const table = userType === "client" ? "clients" : "technicians";

      const { error } = await supabase
        .from(table)
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          ...(userType === "technician" && {
            bio: formData.bio,
            location: formData.location,
            experience: formData.experience,
          }),
        })
        .eq("id", profileData.id);

      if (error) throw error;

      setProfileData((prev) => ({ ...prev!, ...formData }));

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading your profile..." />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] pt-16">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="md:col-span-1">
            <Card className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-blue-50 p-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage
                    src={
                      profileData?.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                    }
                    alt={profileData?.full_name || "User"}
                  />
                  <AvatarFallback>
                    {profileData?.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mt-4">
                  {profileData?.full_name}
                </h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {userType === "client" ? "Client" : "Technician"}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">
                        {profileData?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-gray-900">
                        {profileData?.address || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {userType === "technician" && (
                    <>
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Experience
                          </p>
                          <p className="text-gray-900">
                            {profileData?.experience || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Service Location
                          </p>
                          <p className="text-gray-900">
                            {profileData?.location || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Form */}
          <div className="md:col-span-2">
            <Card className="border border-gray-100 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  {userType === "technician" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="location">Service Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. Seattle, WA"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          name="experience"
                          value={formData.experience || ""}
                          onChange={handleInputChange}
                          placeholder="e.g. 5+ years"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio || ""}
                          onChange={handleInputChange}
                          placeholder="Tell clients about your expertise and services..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </>
                  )}

                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
