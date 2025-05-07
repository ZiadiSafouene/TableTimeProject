import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import TimeTableUploader from './TimeTableUploader';

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const hours = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"];

export interface TimeTableEntry {
  day: string;
  time: string;
  course: string;
  teacher: string;
  location: string;
  class: string;
}

interface IncomingTimeTableData {
  [day: string]: Array<{
    day: string;
    time: string;
    room: string;
    class: string;
    teacher: any;
    lecture: any;
  }>;
}

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

const convertTimeToSlot = (timeStr: string): string => {
  const startTime = timeStr.includes('-') ? 
    timeStr.split('-')[0].trim() : 
    timeStr;
  
  const hour = parseInt(startTime.split(':')[0]);
  const minute = parseInt(startTime.split(':')[1] || '0');
  
  if (hour < 8 || (hour === 8 && minute < 30)) return "08:00";
  else if (hour < 9 || (hour === 9 && minute < 30)) return "09:30";
  else if (hour < 11 || (hour === 11 && minute < 30)) return "11:00";
  else if (hour < 12 || (hour === 12 && minute < 30)) return "12:30";
  else if (hour < 14 || (hour === 14 && minute < 30)) return "14:00";
  else if (hour < 15 || (hour === 15 && minute < 30)) return "15:30";
  else return "17:00";
};

const transformIncomingData = (data: IncomingTimeTableData): TimeTableEntry[] => {
  const result: TimeTableEntry[] = [];
  const dayMap: Record<string, string> = {
    "monday": "Lundi",
    "tuesday": "Mardi",
    "wednesday": "Mercredi",
    "thursday": "Jeudi",
    "friday": "Vendredi",
    "saturday": "Samedi",
    "sunday": "Dimanche"
  };

  Object.entries(data).forEach(([day, entries]) => {
    entries.forEach(entry => {
      const timeSlot = convertTimeToSlot(entry.time);
      
      result.push({
        day: dayMap[day.toLowerCase()] || day,
        time: timeSlot,
        course: entry.lecture || "Unknown Course",
        teacher: entry.teacher || "Unknown Teacher",
        location: entry.room,
        class: entry.class
      });
    });
  });

  return result;
};

const AdminTimeTableEditor = () => {
  const [viewMode, setViewMode] = useState<'classes' | 'teachers'>('classes');
  const [timeTableData, setTimeTableData] = useState<TimeTableEntry[]>([]);
  const [showUploader, setShowUploader] = useState(true);
  const [approvedMakeups, setApprovedMakeups] = useState<MakeupRequest[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  useEffect(() => {
    // Example initialization with sample data
    const initialData: IncomingTimeTableData = {
      "monday": [],
      "tuesday": [{
        "day": "tuesday", 
        "time": "16:30 - 18:00", 
        "room": "A-KANOUN", 
        "class": "A-KANOUN", 
        "teacher": NaN, 
        "lecture": NaN
      }],
      "wednesday": [{
        "day": "wednesday", 
        "time": "14:45 - 16:15", 
        "room": "A-KANOUN", 
        "class": "A-KANOUN", 
        "teacher": NaN, 
        "lecture": NaN
      }],
      "thursday": [{
        "day": "thursday", 
        "time": "13:00 - 14:30", 
        "room": "A-KANOUN", 
        "class": "A-KANOUN", 
        "teacher": NaN, 
        "lecture": NaN
      }],
      "friday": [{
        "day": "friday", 
        "time": "12:00 - 13:30", 
        "room": "A-KANOUN", 
        "class": "A-KANOUN", 
        "teacher": NaN, 
        "lecture": NaN
      }],
      "saturday": [{
        "day": "saturday", 
        "time": "10:15 - 11:45", 
        "room": "A-KANOUN", 
        "class": "A-KANOUN", 
        "teacher": NaN, 
        "lecture": NaN
      }],
      "sunday": [{
        "day": "sunday", 
        "time": "08:30 - 10:00", 
        "room": "A-KANOUN", 
        "class": "A-KANOUN", 
        "teacher": NaN, 
        "lecture": NaN
      }]
    };
    
    setTimeTableData(transformIncomingData(initialData));
    setShowUploader(false);
  }, []);

  const handleDataLoaded = (data: TimeTableEntry[]) => {
    setTimeTableData(data);
    setShowUploader(false);
  };
  
  const handleIncomingData = (rawData: IncomingTimeTableData) => {
    const transformedData = transformIncomingData(rawData);
    setTimeTableData(transformedData);
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
    toast({
      title: "Modifications sauvegardées",
      description: `${timeTableData.length} entrées d'emploi du temps ont été sauvegardées.`
    });
  };
  const fetchTimeTableData = async (type: 'class' | 'teacher', name: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/${type}-dashboard/${name}/`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      handleIncomingData(data); // Transforms and updates state
    } catch (error) {
      toast({ title: "Error", description: "Failed to load timetable", variant: "destructive" });
    }
  };
  useEffect(() => {
    if (viewMode === 'classes' && selectedClass) {
      fetchTimeTableData('class', selectedClass);
    } else if (viewMode === 'teachers' && selectedTeacher) {
      fetchTimeTableData('teacher', selectedTeacher);
    }
  }, [viewMode, selectedClass, selectedTeacher]);
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
                value={viewMode === 'classes' ? selectedClass : selectedTeacher}
                onValueChange={(value) => {
                  if (viewMode === 'classes') setSelectedClass(value);
                  else setSelectedTeacher(value);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={`Choisir ${viewMode === 'classes' ? 'une classe' : 'un enseignant'}`} />
                </SelectTrigger>
                <SelectContent>
                  {viewMode === 'classes' ? (
                    <>
                      <SelectItem value="Math101">Math 101</SelectItem>
                      <SelectItem value="Physics201">Physics 201</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    </>
                  )}
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
                                  value={entry.course || ''}
                                  onChange={(e) => handleEntryChange(entryIndex, 'course', e.target.value)}
                                  className="text-sm"
                                />
                                <div className="grid grid-cols-2 gap-1">
                                  <Input 
                                    placeholder={viewMode === 'classes' ? "Enseignant" : "Classe"}
                                    value={viewMode === 'classes' ? (entry.teacher || '') : (entry.class || '')}
                                    onChange={(e) => handleEntryChange(
                                      entryIndex, 
                                      viewMode === 'classes' ? 'teacher' : 'class', 
                                      e.target.value
                                    )}
                                    className="text-sm"
                                  />
                                  <Input 
                                    placeholder="Salle"
                                    value={entry.location || ''}
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
// At the bottom of AdminTimeTableEditor.tsx (before the last export statement)
export const makeupRequests: MakeupRequest[] = [
  { id: 1, teacher: "Prof. Martin", class: "Informatique 3", date: "2024-05-10", time: "14:00-16:00", reason: "Maladie" },
  { id: 2, teacher: "Prof. Dubois", class: "Mathématiques 2", date: "2024-05-12", time: "10:00-12:00", reason: "Absence administrative" },
  { id: 3, teacher: "Prof. Bernard", class: "Physique 1", date: "2024-05-15", time: "08:00-10:00", reason: "Formation" },
];

export default AdminTimeTableEditor;