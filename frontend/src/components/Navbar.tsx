
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, Info, Contact, LogOut, Bell, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MakeupClassForm from "./MakeupClassForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MakeupRequest, makeupRequests as initialMakeupRequests } from "./AdminTimeTableEditor";

const Navbar = () => {
  const { logout, userType } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<MakeupRequest[]>(initialMakeupRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApprove = (id: number) => {
    // Call the global approve function from Index.tsx
    if (window.handleApproveMakeupClass) {
      window.handleApproveMakeupClass(id);
    }
    
    // Remove notification
    setNotifications(notifications.filter(req => req.id !== id));
  };

  const handleDeny = (id: number) => {
    setNotifications(notifications.filter(req => req.id !== id));
    // Here you would also update the backend
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex">
          <a href="/home" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-900">EduTimetable</span>
          </a>
        </div>
        <nav className="hidden mx-6 items-center space-x-4 md:flex lg:space-x-6 flex-grow">
          <Button 
            onClick={() => scrollToSection('timetable')} 
            variant="ghost" 
            className="text-gray-700 hover:text-blue-700"
          >
            Emplois du temps
          </Button>
          <Button 
            onClick={() => scrollToSection('about')} 
            variant="ghost" 
            className="text-gray-700 hover:text-blue-700"
          >
            <Info className="mr-2 h-4 w-4" />
            À Propos
          </Button>
          <Button 
            onClick={() => scrollToSection('contact')} 
            variant="ghost" 
            className="text-gray-700 hover:text-blue-700"
          >
            <Contact className="mr-2 h-4 w-4" />
            Contact
          </Button>
        </nav>
        <div className="ml-auto flex items-center space-x-3">
          {userType === 'enseignant' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="relative">
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">Demander un rattrapage</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <MakeupClassForm onSubmit={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          {userType === 'admin' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Demandes de rattrapage</h3>
                </div>
                <div className="max-h-96 overflow-auto">
                  {notifications.length > 0 ? (
                    notifications.map((req) => (
                      <div key={req.id} className="p-4 border-b">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{req.teacher}</p>
                            <p className="text-sm text-gray-500">{req.class}</p>
                          </div>
                          <div className="text-xs text-gray-500">{req.date}</div>
                        </div>
                        <div className="mb-2">
                          <p className="text-sm">Horaire: {req.time}</p>
                          <p className="text-sm">Motif: {req.reason}</p>
                        </div>
                        <div className="flex justify-end space-x-2 mt-2">
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeny(req.id)}
                          >
                            Refuser
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(req.id)}
                          >
                            Approuver
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Pas de demandes en attente
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
