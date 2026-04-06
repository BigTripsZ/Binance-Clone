import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { Toast } from '@/components/Toast';
import { Login } from '@/pages/Login';
import { Password } from '@/pages/Password';
import { Verification } from '@/pages/Verification';
import { StayLoggedIn } from '@/pages/StayLoggedIn';
import { ServiceSuspension } from '@/pages/ServiceSuspension';
import { Withdrawal } from '@/pages/Withdrawal';
import { PendingPage } from '@/pages/PendingPage';
import { storage } from '@/storage';

// Protected route component - checks if user has completed login flow
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = storage.getUserSession();

  if (!session.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Auth flow guard - prevents accessing auth pages after login
function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = storage.getUserSession();

  if (session.isLoggedIn) {
    return <Navigate to="/service-suspension" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes - guarded to prevent access when logged in */}
          <Route path="/" element={<AuthGuard><Login /></AuthGuard>} />
          <Route path="/password" element={<AuthGuard><Password /></AuthGuard>} />
          <Route path="/verification" element={<AuthGuard><Verification /></AuthGuard>} />
          
          {/* Stay Logged In - part of auth flow, not protected */}
          <Route path="/stay-logged-in" element={<StayLoggedIn />} />

          {/* Protected Routes - require login */}
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
                <PendingPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toast />
    </AppProvider>
  );
}

export default App;
