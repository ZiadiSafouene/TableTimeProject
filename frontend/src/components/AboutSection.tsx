
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            À Propos de Notre Service
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Découvrez comment notre plateforme simplifie la gestion des emplois du temps 
            pour les établissements d'enseignement supérieur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">Notre Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Notre mission est de simplifier le processus complexe de gestion des emplois du temps universitaires. 
                En transformant un fichier Excel complet en emplois du temps individuels, nous permettons aux 
                administrateurs, enseignants et étudiants d'accéder facilement aux informations dont ils ont besoin,
                quand ils en ont besoin.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">Fonctionnalités Clés</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Importation facile de fichiers Excel complexes</li>
                <li>Génération automatique d'emplois du temps par classe</li>
                <li>Génération automatique d'emplois du temps par enseignant</li>
                <li>Visualisation claire et organisée</li>
                <li>Exportation dans différents formats</li>
                <li>Interface intuitive et conviviale</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-blue-50 rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Comment ça fonctionne
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-700">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Importez</h4>
                <p className="text-gray-600 text-center">
                  Téléchargez votre fichier Excel contenant tous les emplois du temps.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-700">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Générez</h4>
                <p className="text-gray-600 text-center">
                  Notre système traite automatiquement les données et crée des emplois du temps séparés.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-700">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Visualisez</h4>
                <p className="text-gray-600 text-center">
                  Consultez et exportez les emplois du temps par classe ou par enseignant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
