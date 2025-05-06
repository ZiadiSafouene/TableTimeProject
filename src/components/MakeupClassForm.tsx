
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MakeupClassFormProps {
  onSubmit: () => void;
}

const MakeupClassForm = ({ onSubmit }: MakeupClassFormProps) => {
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1:30");
  const [reason, setReason] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Here we'd typically send this to an API
    console.log({
      className,
      date,
      time,
      duration,
      reason,
      location
    });
    
    toast({
      title: "Demande envoyée",
      description: "Votre demande de rattrapage a été envoyée à l'administration.",
    });
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>Demande de rattrapage</DialogTitle>
        <DialogDescription>
          Remplissez ce formulaire pour demander une séance de rattrapage.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="class">Classe</Label>
          <Input
            id="class"
            placeholder="Nom du cours"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">Heure</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="duration">Durée</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Durée du cours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:30">1h30</SelectItem>
                <SelectItem value="2:00">2h00</SelectItem>
                <SelectItem value="3:00">3h00</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Salle</Label>
            <Input
              id="location"
              placeholder="Salle"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="reason">Motif</Label>
          <Textarea
            id="reason"
            placeholder="Veuillez expliquer le motif de ce rattrapage"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">Envoyer la demande</Button>
      </div>
    </form>
  );
};

export default MakeupClassForm;
