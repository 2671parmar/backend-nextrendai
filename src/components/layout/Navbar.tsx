
import { useState } from "react";
import { Bell, ChevronDown, Menu, User } from "lucide-react";
import { Role } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  toggleSidebar: () => void;
  onLogout: () => void;
  userRole: Role;
}

const Navbar = ({ toggleSidebar, onLogout, userRole }: NavbarProps) => {
  const [notifications] = useState(3); // Mock notification count
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="mr-4"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex-shrink-0">
              <img 
                src="/lovable-uploads/a36b95d7-3d5a-49cb-8cfb-136f1caf65eb.png" 
                alt="NEXTREND.AI Logo" 
                className="h-8 w-auto"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nextrend-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-nextrend-green text-white text-xs font-medium items-center justify-center">
                      {notifications}
                    </span>
                  </span>
                )}
              </Button>
            </div>
            
            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-nextrend-green text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">John Doe</span>
                    <span className="text-xs text-gray-500 capitalize">{userRole}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
