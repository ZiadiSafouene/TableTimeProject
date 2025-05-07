
import { useEffect, useRef } from 'react';
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
  const { isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();
  const adminTimeTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Function to handle approval of makeup classes
  const handleApproveMakeupClass = (requestId: number) => {
    if (window.approveMakeupClass) {
      window.approveMakeupClass(requestId);
    }
  };

  // Export the handler to be accessible
  useEffect(() => {
    // Make the approval handler available globally
    window.handleApproveMakeupClass = handleApproveMakeupClass;
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <section id="timetable" className="py-16 bg-gray-50" ref={adminTimeTableRef}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Gestion des emplois du temps
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {userType === 'admin' 
                  ? "En tant qu'administrateur, vous pouvez importer et modifier les emplois du temps pour toutes les classes et enseignants."
                  : userType === 'enseignant'
                    ? "En tant qu'enseignant, vous pouvez consulter vos emplois du temps et faire des demandes de rattrapage."
                    : "En tant qu'étudiant, vous pouvez consulter les emplois du temps de vos cours."
                }
              </p>
            </div>
            
            {userType === 'admin' ? (
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

// Declare global method for handling approvals
declare global {
  interface Window {
    handleApproveMakeupClass?: (requestId: number) => void;
  }
}

export default Index;
