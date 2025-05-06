
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'etudiant' | 'enseignant' | 'admin'>('etudiant');
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password, userType, adminCode);
      if (success) {
        navigate('/home');
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
            <CardTitle className="text-2xl font-bold text-blue-900">Connexion</CardTitle>
            <CardDescription>
              Entrez votre email et mot de passe pour vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <Key size={18} />
                    </span>
                    <Input
                      id="password"
                      placeholder="Mot de passe"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {userType === "admin" && (
                  <div className="space-y-2">
                    <Label htmlFor="adminCode">Code Administrateur</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400">
                        <Key size={18} />
                      </span>
                      <Input
                        id="adminCode"
                        placeholder="Code administrateur"
                        type={showPassword ? "text" : "password"}
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="userType">Type de compte</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="etudiant"
                        name="userType"
                        className="mr-2"
                        checked={userType === "etudiant"}
                        onChange={() => setUserType("etudiant")}
                      />
                      <Label htmlFor="etudiant" className="cursor-pointer">Étudiant</Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="enseignant"
                        name="userType"
                        className="mr-2"
                        checked={userType === "enseignant"}
                        onChange={() => setUserType("enseignant")}
                      />
                      <Label htmlFor="enseignant" className="cursor-pointer">Enseignant</Label>
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

                <div className="pt-6">
                  <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <div className="text-center text-sm">
              <Link to="/signup" className="text-blue-700 hover:underline">Créer un compte</Link>
            </div>
            <div className="text-center text-sm">
              <Link to="/forgot-password" className="text-blue-700 hover:underline">Mot de passe oublié ?</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
