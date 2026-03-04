import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import JobApplications from './pages/JobApplications';
import PostJob from './pages/PostJob';
import JobDetails from './pages/JobDetails';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-slate-50">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/jobs" element={<Home />} />
                            <Route path="/jobs/:id" element={<JobDetails />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
                            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
                            <Route path="/admin-dashboard" element={<AdminDashboard />} />
                            <Route path="/job-applications/:jobId" element={<JobApplications />} />
                            <Route path="/post-job" element={<PostJob />} />
                        </Routes>
                    </main>

                    <footer className="border-t border-slate-200 py-12 mt-20">
                        <div className="container mx-auto px-8 text-center text-slate-500 uppercase text-[10px] tracking-[0.3em] font-bold">
                            <p>© 2026 HireStream. Built with passion for the modern worker.</p>
                        </div>
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
