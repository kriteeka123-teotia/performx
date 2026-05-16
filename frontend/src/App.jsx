import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useContext } from 'react';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Layout from './components/Layout/Layout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />; // Redirect to default dash if wrong role
  }

  return <Layout>{children}</Layout>;
};

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case 'Admin': return <Navigate to="/admin" />;
    case 'Manager': return <Navigate to="/manager" />;
    default: return <Navigate to="/employee" />;
  }
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<DashboardRouter />} />
            
            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={['Employee', 'Manager', 'Admin']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/manager" element={
              <ProtectedRoute allowedRoles={['Manager', 'Admin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
