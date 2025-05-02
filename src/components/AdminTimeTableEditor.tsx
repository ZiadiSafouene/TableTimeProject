
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import TimeTableUploader from './TimeTableUploader';
import { TimeTableEntry } from '@/utils/excelParser';

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const hours = ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00"];

const AdminTimeTableEditor = () => {
  const [viewMode, setViewMode] = useState<'classes' | 'teachers'>('classes');
  const [timeTableData, setTimeTableData] = useState<TimeTableEntry[]>([]);
  const [showUploader, setShowUploader] = useState(true);
  
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
    
    // Pour l'exemple, on affiche simplement un toast
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

export default AdminTimeTableEditor;
