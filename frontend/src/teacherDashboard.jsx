// FILE: src/teacherDashboard.jsx

// --- React and Router Imports ---
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Third-Party Imports (Icons) ---
import { MoreHorizontal, Plus, Calendar, Users, BookOpen, Clock, Eye, Edit, Trash2, Download, LogOut, Settings, BarChart3, TrendingUp, AlertCircle } from "lucide-react";

// --- Custom Component Imports ---
import { ExamPerformanceChart } from "@/components/ExamPerformanceChart";

// --- Shadcn/UI Component Imports ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // This will now be used
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

// --- Mock Data ---
const dashboardStats = { activeExams: 3, totalStudents: 245, completedExams: 12, averageScore: 78.5 };
const exams = [
  { id: "EXM001", name: "Data Structures Midterm", date: "2024-03-15", duration: 120, students: 45, completed: 42, status: "Completed", averageScore: 82.3 },
  { id: "EXM002", name: "Algorithms Final", date: "2024-05-20", duration: 180, students: 50, completed: 45, status: "Completed", averageScore: 71.5 },
  { id: "EXM003", name: "Database Systems Quiz", date: "2024-04-10", duration: 60, students: 38, completed: 35, status: "In Progress", averageScore: 75.8 },
  { id: "EXM004", name: "Intro to Python Test", date: "2024-06-01", duration: 45, students: 60, completed: 0, status: "Scheduled", averageScore: null },
];
const recentActivity = [ { id: 1, action: "Student John submitted EXM001", time: "2 minutes ago" }, { id: 2, action: "Exam EXM002 scheduled", time: "1 hour ago" }, { id: 3, action: "Results published for EXM001", time: "3 hours ago" }, ];

export default function TeacherDashboard() {
  const [examForm, setExamForm] = useState({ name: '', description: '', date: '', duration: '', questions: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [deleteExamId, setDeleteExamId] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const chartData = exams
    .filter(exam => exam.status === 'Completed' && exam.averageScore !== null)
    .map(exam => ({
      name: exam.name,
      averageScore: exam.averageScore,
      participationRate: (exam.completed / exam.students) * 100,
    }));

  const handleCreateExam = async (e) => { e.preventDefault(); /* ... */ };
  const handleDeleteExam = async (examId) => { console.log('Deleting exam:', examId); setDeleteExamId(null); };
  const handleLogout = () => { navigate('/login'); };
  const handleViewResults = (examId) => { navigate(`/teacher/exam/${examId}/results`); };
  const handleEditExam = (examId) => { navigate(`/teacher/exam/${examId}/edit`); };
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'Scheduled': return <Badge variant="secondary">Scheduled</Badge>;
      case 'In Progress': return <Badge variant="destructive" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b"><div className="container mx-auto px-6 py-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1><p className="text-gray-600 dark:text-gray-400">Welcome back, Dr. Smith</p></div><div className="flex items-center gap-4"><Button variant="outline" size="sm" className="gap-2"><Settings className="h-4 w-4" />Settings</Button><Button variant="outline" size="sm" onClick={handleLogout} className="gap-2"><LogOut className="h-4 w-4" />Log Out</Button></div></div></div></div>
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="gap-2"><BarChart3 className="h-4 w-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="create-exam" className="gap-2"><Plus className="h-4 w-4" />Create Exam</TabsTrigger>
            <TabsTrigger value="exams" className="gap-2"><BookOpen className="h-4 w-4" />All Exams</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Exams</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardStats.activeExms}</div><p className="text-xs text-muted-foreground">2 scheduled, 1 in progress</p></CardContent></Card><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardStats.totalStudents}</div><p className="text-xs text-muted-foreground">Across all courses</p></CardContent></Card><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completed Exams</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardStats.completedExams}</div><p className="text-xs text-muted-foreground">This semester</p></CardContent></Card><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Average Score</CardTitle><BarChart3 className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{dashboardStats.averageScore}%</div><p className="text-xs text-muted-foreground">+2.5% from last month</p></CardContent></Card></div>
            <div className="grid gap-6 md:grid-cols-2"><Card><CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader><CardContent><div className="space-y-4">{recentActivity.map((activity) => (<div key={activity.id} className="flex items-center justify-between border-b pb-2"><p className="text-sm">{activity.action}</p><span className="text-xs text-muted-foreground">{activity.time}</span></div>))}</div></CardContent></Card><Card><CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader><CardContent className="space-y-3"><Button className="w-full gap-2" onClick={() => setActiveTab("create-exam")}><Plus className="h-4 w-4" />Create New Exam</Button><Button variant="outline" className="w-full gap-2"><Download className="h-4 w-4" />Export Results</Button><Button variant="outline" className="w-full gap-2"><Users className="h-4 w-4" />Manage Students</Button></CardContent></Card></div>
          </TabsContent>
          
          <TabsContent value="create-exam">
            <Card><CardHeader><CardTitle>Create a New Exam</CardTitle><CardDescription>Set up a new examination for your students</CardDescription></CardHeader><CardContent><form onSubmit={handleCreateExam} className="space-y-6"><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="exam-name">Exam Name *</Label><Input id="exam-name" value={examForm.name} onChange={(e) => setExamForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Data Structures Final Exam" required /></div><div className="space-y-2"><Label htmlFor="exam-duration">Duration (minutes) *</Label><Input id="exam-duration" type="number" value={examForm.duration} onChange={(e) => setExamForm(prev => ({ ...prev, duration: e.target.value }))} placeholder="120" required /></div></div><div className="space-y-2"><Label htmlFor="exam-description">Description</Label><Textarea id="exam-description" value={examForm.description} onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief description of the exam content..." rows={3} /></div><div className="space-y-2"><Label htmlFor="exam-date">Exam Date & Time *</Label><Input id="exam-date" type="datetime-local" value={examForm.date} onChange={(e) => setExamForm(prev => ({ ...prev, date: e.target.value }))} required /></div><div className="space-y-2"><Label htmlFor="exam-questions">Questions (JSON Format) *</Label><Textarea id="exam-questions" value={examForm.questions} onChange={(e) => setExamForm(prev => ({ ...prev, questions: e.target.value }))} rows={10} placeholder={`[...]`} className="font-mono text-sm" required /></div><div className="flex gap-4"><Button type="submit" disabled={isCreating} className="gap-2">{isCreating ? (<><Clock className="h-4 w-4 animate-spin" />Creating...</>) : (<><Plus className="h-4 w-4" />Create Exam</>)}</Button><Button type="button" variant="outline" onClick={() => setExamForm({ name: '', description: '', date: '', duration: '', questions: '' })}>Reset Form</Button></div></form></CardContent></Card>
          </TabsContent>
          
          <TabsContent value="exams">
            <Card><CardHeader><CardTitle>All Exams</CardTitle><CardDescription>Manage your examinations</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Exam ID</TableHead><TableHead>Name</TableHead><TableHead>Date</TableHead><TableHead>Duration</TableHead><TableHead>Students</TableHead><TableHead>Completed</TableHead><TableHead>Status</TableHead><TableHead>Avg Score</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{exams.map((exam) => (<TableRow key={exam.id}><TableCell className="font-mono">{exam.id}</TableCell><TableCell className="font-medium">{exam.name}</TableCell><TableCell>{exam.date}</TableCell><TableCell>{exam.duration}m</TableCell><TableCell>{exam.students}</TableCell><TableCell>{exam.completed}/{exam.students}</TableCell><TableCell>{getStatusBadge(exam.status)}</TableCell><TableCell>{exam.averageScore ? `${exam.averageScore}%` : '-'}</TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem onClick={() => handleViewResults(exam.id)}><Eye className="mr-2 h-4 w-4" />View Results</DropdownMenuItem><DropdownMenuItem onClick={() => handleEditExam(exam.id)}><Edit className="mr-2 h-4 w-4" />Edit Exam</DropdownMenuItem><DropdownMenuItem><Download className="mr-2 h-4 w-4" />Export Data</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => setDeleteExamId(exam.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete Exam</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card><CardHeader><CardTitle>Exam Performance Analysis</CardTitle><CardDescription>Comparing average scores and student participation rates across completed exams.</CardDescription></CardHeader><CardContent className="pl-0 pr-4 pt-4"><ExamPerformanceChart data={chartData} /></CardContent></Card>
          </TabsContent>
        </Tabs>
        <AlertDialog open={!!deleteExamId} onOpenChange={() => setDeleteExamId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the exam and all associated student data.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteExamId && handleDeleteExam(deleteExamId)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      </div>
    </div>
  );
}