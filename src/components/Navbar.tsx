
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Home, Info, Contact, LogOut } from 'lucide-react';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
            onClick={() => scrollToSection('upload')} 
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
        <div className="ml-auto flex items-center">
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
