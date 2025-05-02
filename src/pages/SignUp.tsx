import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student_teacher');
  const [adminCode, setAdminCode] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await register(email, password, name, userType, adminCode, idNumber);
      if (success) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-blue-900">Créer un compte</CardTitle>
            <CardDescription>
              Entrez vos informations pour créer un nouveau compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <User size={18} />
                  </span>
                  <Input
                    id="name"
                    placeholder="Votre nom complet"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <Input
                    id="email"
                    placeholder="exemple@universite.fr"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  placeholder="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">Type de compte</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="student_teacher"
                      name="userType"
                      className="mr-2"
                      checked={userType === "student_teacher"}
                      onChange={() => setUserType("student_teacher")}
                    />
                    <Label htmlFor="student_teacher" className="cursor-pointer">Étudiant/Enseignant</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="admin"
                      name="userType"
                      className="mr-2"
                      checked={userType === "admin"}
                      onChange={() => setUserType("admin")}
                    />
                    <Label htmlFor="admin" className="cursor-pointer">Administrateur</Label>
                  </div>
                </div>
              </div>

              {userType === "admin" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="adminCode">Code Administrateur</Label>
                    <Input
                      id="adminCode"
                      placeholder="Code administrateur"
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">Numéro de carte d'identité</Label>
                    <Input
                      id="idNumber"
                      placeholder="Numéro de carte d'identité"
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </div>
                </>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-blue-700 hover:bg-blue-800"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Création du compte...' : 'Créer un compte'}
            </Button>
            <div className="text-center text-sm">
              <Link to="/login" className="text-blue-700 hover:underline">
                Vous avez déjà un compte ? Se connecter
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
