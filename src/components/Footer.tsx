
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gray-50 border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg text-blue-900 mb-4">EduTimetable</h3>
            <p className="text-gray-600">
              Solution de gestion des emplois du temps pour les établissements d'enseignement supérieur.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-blue-900 mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-700">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-blue-700">
                  À Propos
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-blue-700">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-blue-900 mb-4">Contact</h3>
            <address className="not-italic text-gray-600">
              <p>Email: contact@edutimetable.fr</p>
              <p>Téléphone: +33 1 23 45 67 89</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {currentYear} EduTimetable. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
