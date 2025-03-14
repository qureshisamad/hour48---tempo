import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import OTPVerification from "./components/auth/OTPVerification";
import UserTypeSelection from "./components/auth/UserTypeSelection";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import ProfilePage from "./components/profile/ProfilePage";
import TechniciansPage from "./components/technicians/TechniciansPage";
import ServicesPage from "./components/services/ServicesPage";
import BookingPage from "./components/booking/BookingPage";
import { AuthProvider, useAuth } from "../supabase/auth";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen, LoadingSpinner } from "./components/ui/loading-spinner";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen text="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/user-type" element={<UserTypeSelection />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="/technicians" element={<TechniciansPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route
          path="/book/:technicianId?"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen text="Loading application..." />}>
        <AppRoutes />
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
