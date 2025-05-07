
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student_teacher');
  const [adminCode, setAdminCode] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validatePasswords = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    const passwordsAreValid = validatePasswords(password, confirmPassword);
    setPasswordsMatch(passwordsAreValid);
    
    if (!passwordsAreValid) {
      return;
    }
    
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
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Mot de passe"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    placeholder="Confirmer le mot de passe"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordsMatch(validatePasswords(password, e.target.value));
                    }}
                    className={`pr-10 ${!passwordsMatch ? "border-red-500" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {!passwordsMatch && (
                  <p className="text-sm text-red-500">Les mots de passe ne correspondent pas</p>
                )}
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
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-700 hover:bg-blue-800"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Création du compte...' : 'Créer un compte'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
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
