
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeTableEntry, groupByClass, groupByTeacher, sortEntriesByDayAndTime, GroupedTimetable } from '@/utils/excelParser';

interface TimeTableViewerProps {
  timeTableData: TimeTableEntry[];
}

const TimeTableViewer = ({ timeTableData }: TimeTableViewerProps) => {
  const [classTimetables, setClassTimetables] = useState<GroupedTimetable>({});
  const [teacherTimetables, setTeacherTimetables] = useState<GroupedTimetable>({});
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('classes');
  
  useEffect(() => {
    const byClass = groupByClass(timeTableData);
    const byTeacher = groupByTeacher(timeTableData);
    
    setClassTimetables(byClass);
    setTeacherTimetables(byTeacher);
    
    // Sélection automatique du premier élément
    const classKeys = Object.keys(byClass);
    const teacherKeys = Object.keys(byTeacher);
    
    if (classKeys.length > 0) {
      setSelectedClass(classKeys[0]);
    }
    
    if (teacherKeys.length > 0) {
      setSelectedTeacher(teacherKeys[0]);
    }
  }, [timeTableData]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderTimetableEntries = (entries: TimeTableEntry[] | undefined) => {
    if (!entries || entries.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          Aucun emploi du temps disponible.
        </div>
      );
    }
    
    // Grouper par jour
    const entriesByDay = entries.reduce((acc, entry) => {
      if (!acc[entry.day]) {
        acc[entry.day] = [];
      }
      acc[entry.day].push(entry);
      return acc;
    }, {} as Record<string, TimeTableEntry[]>);
    
    // Ordre des jours de la semaine
    const dayOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    // Trier les jours
    const sortedDays = Object.keys(entriesByDay).sort(
      (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
    );

    return (
      <div className="space-y-6">
        {sortedDays.map(day => (
          <Card key={day} className="overflow-hidden">
            <CardHeader className="bg-blue-50 py-4">
              <CardTitle className="text-blue-900">{day}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Heure</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cours</th>
                      {activeTab === 'classes' && (
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Enseignant</th>
                      )}
                      {activeTab === 'teachers' && (
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Classe</th>
                      )}
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Salle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortEntriesByDayAndTime(entriesByDay[day]).map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{entry.time}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.course}</td>
                        {activeTab === 'classes' && (
                          <td className="px-4 py-3 text-sm text-gray-700">{entry.teacher}</td>
                        )}
                        {activeTab === 'teachers' && (
                          <td className="px-4 py-3 text-sm text-gray-700">{entry.class}</td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-700">{entry.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Emplois du temps</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="classes" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="classes">Par classe</TabsTrigger>
            <TabsTrigger value="teachers">Par enseignant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="classes" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-full max-w-sm">
                <Select
                  value={selectedClass}
                  onValueChange={(value) => setSelectedClass(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(classTimetables).map(className => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={() => {
                  // Fonctionnalité d'export qui serait implémentée ici
                  console.log('Export emploi du temps de classe:', selectedClass);
                }}
              >
                Exporter
              </Button>
            </div>
            
            {selectedClass && renderTimetableEntries(classTimetables[selectedClass])}
          </TabsContent>
          
          <TabsContent value="teachers" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-full max-w-sm">
                <Select
                  value={selectedTeacher}
                  onValueChange={(value) => setSelectedTeacher(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un enseignant" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(teacherTimetables).map(teacherName => (
                      <SelectItem key={teacherName} value={teacherName}>
                        {teacherName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={() => {
                  // Fonctionnalité d'export qui serait implémentée ici
                  console.log('Export emploi du temps enseignant:', selectedTeacher);
                }}
              >
                Exporter
              </Button>
            </div>
            
            {selectedTeacher && renderTimetableEntries(teacherTimetables[selectedTeacher])}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TimeTableViewer;
