
import * as XLSX from 'xlsx';

export interface TimeTableEntry {
  day: string;
  time: string;
  course: string;
  teacher: string;
  location: string;
  class: string;
}

// Type pour les emplois du temps groupés par classe ou professeur
export interface GroupedTimetable {
  [key: string]: TimeTableEntry[];
}

// Cette fonction transforme un fichier Excel en tableau d'objets
export const parseExcelFile = async (file: File): Promise<TimeTableEntry[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir la feuille en objets JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transformer les données selon notre structure
        const timeTableEntries: TimeTableEntry[] = rawData.map((row: any) => ({
          day: row.Jour || '',
          time: row.Heure || '',
          course: row.Cours || row.Matière || '',
          teacher: row.Enseignant || row.Professeur || '',
          location: row.Salle || row.Local || '',
          class: row.Classe || row.Groupe || '',
        }));
        
        resolve(timeTableEntries);
      } catch (error) {
        console.error("Erreur lors de l'analyse du fichier Excel:", error);
        reject("Impossible d'analyser le fichier Excel. Veuillez vérifier son format.");
      }
    };
    
    reader.onerror = () => {
      reject("Erreur lors de la lecture du fichier.");
    };
    
    reader.readAsBinaryString(file);
  });
};

// Grouper les emplois du temps par classe
export const groupByClass = (entries: TimeTableEntry[]): GroupedTimetable => {
  return entries.reduce((acc: GroupedTimetable, entry) => {
    if (!acc[entry.class]) {
      acc[entry.class] = [];
    }
    acc[entry.class].push(entry);
    return acc;
  }, {});
};

// Grouper les emplois du temps par enseignant
export const groupByTeacher = (entries: TimeTableEntry[]): GroupedTimetable => {
  return entries.reduce((acc: GroupedTimetable, entry) => {
    if (!acc[entry.teacher]) {
      acc[entry.teacher] = [];
    }
    acc[entry.teacher].push(entry);
    return acc;
  }, {});
};

// Trier les entrées par jour et heure
export const sortEntriesByDayAndTime = (entries: TimeTableEntry[]): TimeTableEntry[] => {
  const dayOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
  return [...entries].sort((a, b) => {
    // D'abord trier par jour
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    
    // Ensuite trier par heure
    return a.time.localeCompare(b.time);
  });
};
