import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import TimeTableUploader from './TimeTableUploader';
import { TimeTableEntry } from '@/utils/excelParser';

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const hours = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"];

// For demonstration purposes, define a type for makeup requests
export interface MakeupRequest {
  id: number;
  teacher: string;
  class: string;
  date: string;
  time: string;
  reason: string;
  location?: string;
  approved?: boolean;
}

// Global state to store makeup requests (in a real app, this would be in a context or redux)
export const makeupRequests: MakeupRequest[] = [
  { id: 1, teacher: "Prof. Martin", class: "Informatique 3", date: "2024-05-10", time: "14:00-16:00", reason: "Maladie" },
  { id: 2, teacher: "Prof. Dubois", class: "Mathématiques 2", date: "2024-05-12", time: "10:00-12:00", reason: "Absence administrative" },
  { id: 3, teacher: "Prof. Bernard", class: "Physique 1", date: "2024-05-15", time: "08:00-10:00", reason: "Formation" },
];

// Function to convert date and time to day and time slot
const convertDateToDay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return dayNames[date.getDay()];
};

const convertTimeToSlot = (timeStr: string): string => {
  // Format should be "HH:MM-HH:MM"
  const startTime = timeStr.split('-')[0].trim();
  const hour = parseInt(startTime.split(':')[0]);
  
  // Map hour to time slot
  if (hour < 9) return "08:00";
  else if (hour < 10) return "09:30";
  else if (hour < 12) return "11:00";
  else if (hour < 14) return "12:30";
  else if (hour < 15) return "14:00";
  else if (hour < 17) return "15:30";
  else return "17:00";
};

const AdminTimeTableEditor = () => {
  const [viewMode, setViewMode] = useState<'classes' | 'teachers'>('classes');
  const [timeTableData, setTimeTableData] = useState<TimeTableEntry[]>([]);
  const [showUploader, setShowUploader] = useState(true);
  const [approvedMakeups, setApprovedMakeups] = useState<MakeupRequest[]>([]);
  
  useEffect(() => {
    // Check for approved makeup classes and add them to the timetable
    approvedMakeups.forEach(makeup => {
      const day = convertDateToDay(makeup.date);
      const time = convertTimeToSlot(makeup.time);
      
      // Create a new timetable entry for the approved makeup
      const newEntry: TimeTableEntry = {
        day,
        time,
        course: makeup.class + " (Rattrapage)",
        teacher: makeup.teacher,
        location: makeup.location || "À déterminer",
        class: makeup.class
      };
      
      // Check if this entry already exists
      const existingEntryIndex = timeTableData.findIndex(
        entry => entry.day === day && entry.time === time && entry.course === newEntry.course
      );
      
      // If it doesn't exist, add it to the timetable
      if (existingEntryIndex === -1) {
        setTimeTableData(prevData => [...prevData, newEntry]);
      }
    });
  }, [approvedMakeups]);

  // Method to be called from Navbar component when approval happens
  window.approveMakeupClass = (requestId: number) => {
    const request = makeupRequests.find(req => req.id === requestId);
    if (request) {
      setApprovedMakeups(prev => [...prev, {...request, approved: true}]);
      toast({
        title: "Rattrapage approuvé",
        description: `Le rattrapage de ${request.teacher} a été ajouté à l'emploi du temps.`,
      });
    }
  };
  
  const handleDataLoaded = (data: TimeTableEntry[]) => {
    setTimeTableData(data);
    setShowUploader(false);
  };
  
  const handleAddEntry = (day: string, hour: string) => {
    const newEntry: TimeTableEntry = {
      day,
      time: hour,
      course: '',
      teacher: '',
      location: '',
      class: ''
    };
    
    setTimeTableData([...timeTableData, newEntry]);
  };
  
  const handleEntryChange = (index: number, field: keyof TimeTableEntry, value: string) => {
    const updatedData = [...timeTableData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setTimeTableData(updatedData);
  };
  
  const getEntryForDayAndTime = (day: string, time: string) => {
    return timeTableData.find(entry => entry.day === day && entry.time === time);
  };
  
  const handleSaveChanges = () => {
    console.log('Saving changes to timetable:', timeTableData);
    // Ici on pourrait implémenter la sauvegarde dans une base de données
    // ou l'export vers un fichier Excel
    
    toast({
      title: "Modifications sauvegardées",
      description: `${timeTableData.length} entrées d'emploi du temps ont été sauvegardées.`
    });
  };
  
  return (
    <div className="space-y-6">
      {showUploader ? (
        <TimeTableUploader onDataLoaded={handleDataLoaded} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Afficher par:</span>
              <Select
                value={viewMode}
                onValueChange={(value) => setViewMode(value as 'classes' | 'teachers')}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Choisir une vue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classes">Classes</SelectItem>
                  <SelectItem value="teachers">Enseignants</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowUploader(true)}
              >
                Importer un nouveau fichier
              </Button>
              <Button 
                onClick={handleSaveChanges}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Enregistrer les modifications
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Horaire</TableHead>
                    {days.map(day => (
                      <TableHead key={day}>{day}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hours.map(hour => (
                    <TableRow key={hour}>
                      <TableCell className="font-medium">{hour}</TableCell>
                      {days.map(day => {
                        const entry = getEntryForDayAndTime(day, hour);
                        const entryIndex = timeTableData.findIndex(e => e === entry);
                        
                        return (
                          <TableCell key={`${day}-${hour}`} className="p-1">
                            {entry ? (
                              <div className="bg-blue-50 p-2 rounded-md space-y-2">
                                <Input 
                                  placeholder="Matière"
                                  value={entry.course}
                                  onChange={(e) => handleEntryChange(entryIndex, 'course', e.target.value)}
                                  className="text-sm"
                                />
                                <div className="grid grid-cols-2 gap-1">
                                  <Input 
                                    placeholder={viewMode === 'classes' ? "Enseignant" : "Classe"}
                                    value={viewMode === 'classes' ? entry.teacher : entry.class}
                                    onChange={(e) => handleEntryChange(
                                      entryIndex, 
                                      viewMode === 'classes' ? 'teacher' : 'class', 
                                      e.target.value
                                    )}
                                    className="text-sm"
                                  />
                                  <Input 
                                    placeholder="Salle"
                                    value={entry.location}
                                    onChange={(e) => handleEntryChange(entryIndex, 'location', e.target.value)}
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                className="w-full h-20 border border-dashed border-gray-300 hover:border-blue-400"
                                onClick={() => handleAddEntry(day, hour)}
                              >
                                +
                              </Button>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// Add global type declaration for the approval function
declare global {
  interface Window {
    approveMakeupClass: (requestId: number) => void;
  }
}

export default AdminTimeTableEditor;
