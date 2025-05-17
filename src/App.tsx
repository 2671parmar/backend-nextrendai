import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import MasterPrompts from "./pages/MasterPrompts";
import MBSCommentary from "./pages/MBSCommentary";
import TrendingTopics from "./pages/TrendingTopics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import MortgageTerms from "./pages/MortgageTerms";
import ContentPrompts from "./pages/ContentPrompts";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/users"
      element={
        <ProtectedRoute>
          <UserManagement />
        </ProtectedRoute>
      }
    />
    <Route
      path="/prompts"
      element={
        <ProtectedRoute>
          <MasterPrompts />
        </ProtectedRoute>
      }
    />
    <Route
      path="/mbs-commentary"
      element={
        <ProtectedRoute>
          <MBSCommentary />
        </ProtectedRoute>
      }
    />
    <Route
      path="/trending-topics"
      element={
        <ProtectedRoute>
          <TrendingTopics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/mortgage-terms"
      element={
        <ProtectedRoute>
          <MortgageTerms />
        </ProtectedRoute>
      }
    />
    <Route
      path="/content-prompts"
      element={
        <ProtectedRoute>
          <ContentPrompts />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
