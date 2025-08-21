// FILE: src/StudentDashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ListChecks, PlayCircle, Loader2 } from "lucide-react";
import apiClient from '@/api/apiClient';

const getStatusBadgeVariant = (status) => {
  // Using uppercase status from the backend schema
  switch (status) {
    case "ACTIVE": return "destructive";
    case "COMPLETED": return "default";
    case "SCHEDULED": return "secondary";
    default: return "outline";
  }
};

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        // This endpoint fetches the list of exams for the currently logged-in student.
        const response = await apiClient.get('/api/v1/student/exams/me');
        setExams(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.detail || "Failed to load exams.";
        setError(errorMessage);
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [navigate]);

  const handleStartExam = (examId) => {
    console.log(`Starting exam ${examId}...`);
    navigate(`/student/platform/${examId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Exams...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Exams</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Here are your scheduled, active, and completed exams.</p>
        </header>
        <main className="grid gap-6">
          {exams.length > 0 ? exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{exam.title}</CardTitle>
                  <CardDescription>Duration: {exam.duration_minutes} minutes</CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(exam.status)} className="text-sm capitalize">
                  {exam.status.toLowerCase()}
                </Badge>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Starts: {new Date(exam.start_time).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  <span>Max Attempts: {exam.max_attempts}</span>
                </div>
              </CardContent>
              <CardFooter>
                {exam.status === "ACTIVE" ? (
                  <Button className="w-full gap-2" onClick={() => handleStartExam(exam.id)}>
                    <PlayCircle className="h-4 w-4" />
                    Start Exam
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    {exam.status === 'COMPLETED' ? 'View Results' : 'Not Yet Available'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )) : (
            <Card><CardContent className="p-6 text-center text-muted-foreground">You are not registered for any exams.</CardContent></Card>
          )}
        </main>
      </div>
    </div>
  );
}