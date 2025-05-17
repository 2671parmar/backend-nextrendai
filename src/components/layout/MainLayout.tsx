import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Role } from "@/types";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { signOut, user, profile } = useAuth();
  
  // In a real app, this would come from an auth context
  const [userRole] = useState<Role>("admin");
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} userRole={userRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          toggleSidebar={toggleSidebar} 
          onLogout={handleLogout}
          userRole={userRole}
          userName={profile?.full_name || profile?.username || user?.email}
        />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
