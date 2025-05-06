
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Users, Edit, BarChart3, Settings } from "lucide-react";
import { Role } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  userRole: Role;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  active: boolean;
}

const SidebarItem = ({ icon, title, path, active }: SidebarItemProps) => {
  const navigate = useNavigate();
  
  return (
    <li>
      <button
        onClick={() => navigate(path)}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md w-full text-left transition-colors",
          active 
            ? "bg-nextrend-green text-white font-medium" 
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <span className="text-inherit">{icon}</span>
        <span>{title}</span>
      </button>
    </li>
  );
};

const Sidebar = ({ isOpen, userRole }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "User Management",
      path: "/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Master Prompts",
      path: "/prompts",
      icon: <Edit className="h-5 w-5" />,
    },
    {
      title: "MBS Commentary",
      path: "/mbs-commentary",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Trending Topics",
      path: "/trending-topics",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-0 sm:w-16 overflow-hidden"
      )}
    >
      <div className="p-4 flex items-center justify-center h-16 border-b border-gray-200">
        {isOpen ? (
          <img 
            src="/lovable-uploads/a36b95d7-3d5a-49cb-8cfb-136f1caf65eb.png" 
            alt="NEXTREND.AI Logo" 
            className="h-6 w-auto"
          />
        ) : (
          <div className="text-nextrend-green font-bold text-xl">N</div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              title={item.title}
              path={item.path}
              active={currentPath === item.path}
            />
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        {isOpen && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm font-medium">Admin Dashboard</div>
            <div className="text-xs text-gray-500">Version 1.0.0</div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
