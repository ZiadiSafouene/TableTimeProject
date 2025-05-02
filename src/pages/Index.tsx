
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AdminTimeTableEditor from '@/components/AdminTimeTableEditor';
import TimeTableViewer from '@/components/TimeTableViewer';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const userIsAdmin = isAdmin();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <section id="timetable" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Gestion des emplois du temps
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {userIsAdmin 
                  ? "En tant qu'administrateur, vous pouvez importer et modifier les emplois du temps pour toutes les classes et enseignants."
                  : "Consultez les emplois du temps par classe ou par enseignant."
                }
              </p>
            </div>
            
            {userIsAdmin ? (
              <AdminTimeTableEditor />
            ) : (
              <TimeTableViewer timeTableData={[]} />
            )}
          </div>
        </section>
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
