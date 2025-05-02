
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { parseExcelFile, TimeTableEntry } from '@/utils/excelParser';
import TimeTableViewer from './TimeTableViewer';

const TimeTableUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [timeTableData, setTimeTableData] = useState<TimeTableEntry[]>([]);
  const [hasData, setHasData] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      
      // Réinitialiser les données si un nouveau fichier est sélectionné
      setTimeTableData([]);
      setHasData(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier Excel d'abord.",
        variant: "destructive",
      });
      return;
    }

    // Vérifier l'extension du fichier
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      toast({
        title: "Format de fichier invalide",
        description: "Veuillez sélectionner un fichier Excel (.xlsx ou .xls).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await parseExcelFile(file);
      
      if (data.length === 0) {
        toast({
          title: "Fichier vide",
          description: "Le fichier ne contient aucune donnée d'emploi du temps.",
          variant: "destructive",
        });
        return;
      }

      setTimeTableData(data);
      setHasData(true);
      
      toast({
        title: "Fichier importé avec succès",
        description: `${data.length} entrées d'emploi du temps ont été chargées.`
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'importation",
        description: error instanceof Error ? error.message : "Une erreur inconnue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-900">Importer un fichier d'emploi du temps</h3>
              <p className="text-gray-600">
                Sélectionnez votre fichier Excel contenant tous les emplois du temps.
                Le fichier doit contenir les colonnes: Jour, Heure, Cours, Enseignant, Salle et Classe.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-grow w-full">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="excel-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-500">XLSX, XLS (MAX. 10MB)</p>
                    </div>
                    <input 
                      id="excel-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".xlsx, .xls" 
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div>
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isLoading}
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  {isLoading ? 'Chargement...' : 'Importer'}
                </Button>
              </div>
            </div>
            
            {file && (
              <div className="text-sm text-gray-600">
                Fichier sélectionné: <span className="font-medium">{file.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {hasData && <TimeTableViewer timeTableData={timeTableData} />}
    </div>
  );
};

export default TimeTableUploader;
