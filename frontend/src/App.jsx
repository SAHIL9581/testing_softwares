import { Routes, Route, Navigate } from "react-router-dom";
import Login from './Login.jsx';
import StudentPlatform from './StudentPlatform.jsx';
import TeacherDashboard from './TeacherDashboard.jsx';
import StudentDashboard from './StudentDashboard.jsx'; // Corrected import
import Page404 from './Page404.jsx';
import APITest from './APITest.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/platform/:examId" element={<StudentPlatform />} /> {/* Added :examId param */}
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/api" element={<APITest />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
export default App;