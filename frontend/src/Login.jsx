import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OtpInput } from "@/components/OtpInput";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showOtp, setShowOtp] = useState(false);
  const [userType, setUserType] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({ password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const form = e.target;
    const studentId = form.elements.namedItem('student-id')?.value;
    const email = form.elements.namedItem('teacher-email')?.value;
    const password = (userType === 'student' ? form.elements.namedItem('student-password')?.value : form.elements.namedItem('teacher-password')?.value) || '';

    if ((userType === 'student' && !studentId) || (userType === 'teacher' && !email) || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    setLoginData(userType === 'student' ? { studentId, password } : { email, password });
    try {
      console.log(`${userType} login attempt:`, loginData);
      setTimeout(() => { setShowOtp(true); setIsLoading(false); }, 1000);
    } catch (err) {
      setError('Could not connect to the server.');
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    console.log(`Verifying OTP: ${otp} for ${userType}`, loginData);
    try {
      console.log('OTP verification successful');
      if (userType === 'student') {
        navigate('/student/platform');
      } else {
        navigate('/teacher/dashboard');
      }
    } catch (err) {
      throw new Error("OTP verification failed");
    }
  };

  const handleBackToLogin = () => { setShowOtp(false); setError(''); setLoginData({ password: '' }); };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {!showOtp ? (
        <Tabs defaultValue="student" className="w-full max-w-[400px]" onValueChange={setUserType}>
          <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="student">Student</TabsTrigger><TabsTrigger value="teacher">Teacher</TabsTrigger></TabsList>
          <TabsContent value="student">
            <form onSubmit={handleLogin}>
              <Card>
                <CardHeader><CardTitle>Student Login</CardTitle><CardDescription>Enter your credentials to start the exam</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="student-id">Student ID</Label><Input id="student-id" name="student-id" placeholder="Enter your student ID" required disabled={isLoading} /></div>
                  <div className="space-y-2"><Label htmlFor="student-password">Password</Label><Input id="student-password" name="student-password" type="password" placeholder="Enter your password" required disabled={isLoading} /></div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {error && (<Alert variant="destructive" className="w-full"><AlertDescription>{error}</AlertDescription></Alert>)}
                  <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
          <TabsContent value="teacher">
            <form onSubmit={handleLogin}>
              <Card>
                <CardHeader><CardTitle>Teacher Login</CardTitle><CardDescription>Access the teacher dashboard</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="teacher-email">Email</Label><Input id="teacher-email" name="teacher-email" type="email" placeholder="teacher@example.com" required disabled={isLoading} /></div>
                  <div className="space-y-2"><Label htmlFor="teacher-password">Password</Label><Input id="teacher-password" name="teacher-password" type="password" placeholder="Enter your password" required disabled={isLoading} /></div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {error && (<Alert variant="destructive" className="w-full"><AlertDescription>{error}</AlertDescription></Alert>)}
                  <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="w-full max-w-[400px]">
          <OtpInput onOtpSubmit={handleOtpSubmit} onBack={handleBackToLogin} userType={userType} />
        </div>
      )}
    </div>
  );
}