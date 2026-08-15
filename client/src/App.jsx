import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Eagerly loaded for instantaneous first paint
import HomePage from "./features/static/HomePage";

// Lazy-loaded routes for performance & code-splitting
const HowItWorksPage = lazy(() => import("./features/static/HowItWorksPage"));
const ContactHelpPage = lazy(() => import("./features/static/ContactHelpPage"));
const NotFoundPage = lazy(() => import("./features/static/NotFoundPage"));

const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("./features/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("./features/auth/ResetPasswordPage"),
);
const VerifyEmailPage = lazy(() => import("./features/auth/VerifyEmailPage"));
const EmailNoticePage = lazy(() => import("./features/auth/EmailNoticePage"));

const ExplorePage = lazy(() => import("./features/destinations/ExplorePage"));
const DestinationDetailPage = lazy(
  () => import("./features/destinations/DestinationDetailPage"),
);

const MyJourneyPage = lazy(() => import("./features/trips/MyJourneyPage"));
const TripDetailPage = lazy(() => import("./features/trips/TripDetailPage"));
const SharedTripPage = lazy(() => import("./features/trips/SharedTripPage"));

const TravelToolsPage = lazy(() => import("./features/tools/TravelToolsPage"));
const ProfilePage = lazy(() => import("./features/profile/ProfilePage"));

// Clean minimal suspense fallback
const PageFallback = () => (
  <div className="min-h-[70vh] flex items-center justify-center bg-[#FCF9F8]">
    <div className="w-8 h-8 border-2 border-[#6C2F00]/20 border-t-[#6C2F00] rounded-full animate-spin" />
  </div>
);

// Prevent logged-in users from seeing login/register
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (!loading && isAuthenticated) {
    return <Navigate to="/my-journey" replace />;
  }
  return children;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* ── Public Routes ── */}
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route
                  path="/destinations/:id"
                  element={<DestinationDetailPage />}
                />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/contact" element={<ContactHelpPage />} />
                <Route path="/help" element={<ContactHelpPage />} />
                <Route path="/share/:token" element={<SharedTripPage />} />

                {/* ── Auth Routes (Public Only) ── */}
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <LoginPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicOnlyRoute>
                      <RegisterPage />
                    </PublicOnlyRoute>
                  }
                />
                <Route path="/check-email" element={<EmailNoticePage />} />
                <Route
                  path="/verify-email/:token"
                  element={<VerifyEmailPage />}
                />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPasswordPage />}
                />

                {/* ── Authenticated Routes ── */}
                <Route
                  path="/my-journey"
                  element={
                    <ProtectedRoute>
                      <MyJourneyPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/:id"
                  element={
                    <ProtectedRoute>
                      <TripDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tools"
                  element={
                    <ProtectedRoute>
                      <TravelToolsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* ── 404 Fallback ── */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
