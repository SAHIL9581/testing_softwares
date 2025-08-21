// This component now connects to a real backend.
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OtpInput } from "@/components/OtpInput";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/apiClient';

export default function Login() {
  const [showOtp, setShowOtp] = useState(false);
  const [userType, setUserType] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const form = e.target;
    const identifier = (userType === 'student' ? form.elements.namedItem('student-id')?.value : form.elements.namedItem('teacher-email')?.value) || '';
    const password = form.elements.namedItem(`${userType}-password`)?.value || '';

    if (!identifier || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    setLoginIdentifier(identifier);

    try {
      // --- API ENDPOINT 1: /api/v1/auth/token ---
      // This sends the username and password to get an OTP.
      // NOTE: Verify this endpoint exists in your docs at http://localhost:8000/docs
      const formData = new URLSearchParams();
      formData.append('username', identifier);
      formData.append('password', password);

      await apiClient.post('/api/v1/auth/token', formData);
      setShowOtp(true);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Invalid credentials or server error.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    try {
      // --- API ENDPOINT 2: /api/v1/auth/token/verify-otp ---
      // This sends the OTP to get the final access token.
      // NOTE: Verify this endpoint exists in your docs at http://localhost:8000/docs
      const response = await apiClient.post('/api/v1/auth/token/verify-otp', {
        username: loginIdentifier,
        otp_code: otp,
      });

      const { access_token, user_role } = response.data;

      if (access_token) {
        localStorage.setItem('accessToken', access_token);
        
        if (user_role === 'student') {
          navigate('/student/dashboard');
        } else if (user_role === 'teacher') {
          navigate('/teacher/dashboard');
        } else {
          setError("Logged in with an unknown user role.");
        }
      } else {
        throw new Error("No access token received.");
      }
    } catch (err) {
      console.error("OTP Verification failed:", err.response?.data?.detail || err.message);
      throw new Error("OTP verification failed.");
    }
  };

  const handleBackToLogin = () => { setShowOtp(false); setError(''); };

  return (
    // The JSX here is the same as before, no changes needed.
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">{!showOtp?(<Tabs defaultValue="student" className="w-full max-w-[400px]" onValueChange={setUserType}><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="student">Student</TabsTrigger><TabsTrigger value="teacher">Teacher</TabsTrigger></TabsList><TabsContent value="student"><form onSubmit={handleLogin}><Card><CardHeader><CardTitle>Student Login</CardTitle><CardDescription>Enter your credentials to start the exam</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="student-id">Student ID</Label><Input id="student-id" name="student-id" placeholder="Enter your student ID" required disabled={isLoading}/></div><div className="space-y-2"><Label htmlFor="student-password">Password</Label><Input id="student-password" name="student-password" type="password" placeholder="Enter your password" required disabled={isLoading}/></div></CardContent><CardFooter className="flex flex-col space-y-4">{error&&<Alert variant="destructive" className="w-full"><AlertDescription>{error}</AlertDescription></Alert>}<Button type="submit" className="w-full" disabled={isLoading}>{isLoading?'Logging in...':'Login'}</Button></CardFooter></Card></form></TabsContent><TabsContent value="teacher"><form onSubmit={handleLogin}><Card><CardHeader><CardTitle>Teacher Login</CardTitle><CardDescription>Access the teacher dashboard</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="teacher-email">Email</Label><Input id="teacher-email" name="teacher-email" type="email" placeholder="teacher@example.com" required disabled={isLoading}/></div><div className="space-y-2"><Label htmlFor="teacher-password">Password</Label><Input id="teacher-password" name="teacher-password" type="password" placeholder="Enter your password" required disabled={isLoading}/></div></CardContent><CardFooter className="flex flex-col space-y-4">{error&&<Alert variant="destructive" className="w-full"><AlertDescription>{error}</AlertDescription></Alert>}<Button type="submit" className="w-full" disabled={isLoading}>{isLoading?'Logging in...':'Login'}</Button></CardFooter></Card></form></TabsContent></Tabs>):(<div className="w-full max-w-[400px]"><OtpInput onOtpSubmit={handleOtpSubmit} onBack={handleBackToLogin} userType={userType}/></div>)}</div>
  );
}