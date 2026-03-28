import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/store/AppContext';
import { ToastContainer } from '@/components/ui/custom/Toast';

// Pages
import Login from '@/pages/Login';
import Password from '@/pages/Password';
import Verification from '@/pages/Verification';
import LoadingScreen from '@/pages/LoadingScreen';
import StayLoggedIn from '@/pages/StayLoggedIn';
import ServiceSuspension from '@/pages/ServiceSuspension';
import Withdrawal from '@/pages/Withdrawal';
import Pending from '@/pages/Pending';
import DashboardLogin from '@/pages/DashboardLogin';
import AdminDashboard from '@/pages/AdminDashboard';

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userSession } = useApp();
  
  if (!userSession.isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/password" element={<Password />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/loading" element={<LoadingScreen />} />
      <Route path="/stay-logged-in" element={<StayLoggedIn />} />
      
      {/* Protected routes */}
      <Route 
        path="/service-suspension" 
        element={
          <ProtectedRoute>
            <ServiceSuspension />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/withdrawal" 
        element={
          <ProtectedRoute>
            <Withdrawal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/pending" 
        element={
          <ProtectedRoute>
            <Pending />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin routes - Dashboard Login and Dashboard */}
      <Route path="/dash" element={<DashboardLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
        <ToastContainer />
      </Router>
    </AppProvider>
  );
}

export default App;
