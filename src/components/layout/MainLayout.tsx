
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Role } from "@/types";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // In a real app, this would come from an auth context
  const [userRole] = useState<Role>("admin");
  
  const handleLogout = () => {
    // In a real app, this would call an auth service
    toast.success("Successfully logged out");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} userRole={userRole} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          toggleSidebar={toggleSidebar} 
          onLogout={handleLogout}
          userRole={userRole} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
