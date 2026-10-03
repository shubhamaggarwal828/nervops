// import { Navigate, Route, Routes } from "react-router-dom";

// // import LoginPage from "./pages/LoginPage";
// import EmailVerificationPage from "./pages/EmailVerificationPage";
// import DashboardPage from "./pages/DashboardPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import LoadingSpinner from "./components/LoadingSpinner";

// import { Toaster } from "react-hot-toast";
// import { useAuthStore } from "./store/authStore";
// import { useEffect } from "react";
// import LoginPage2 from "./pages/LoginPage2";
// import ResetPassword from "./pages/ResetPassword";
// import SignUpPage2 from "./pages/SignUpPage2";
// import EmailVerificationPage2 from "./pages/EmailVerificationPage2";
// import CreateUptimeCheck from "./components/Dashboard/CreateUptimeCheck";
// import Dashboard from "./components/Dashboard/Dashboard";
// import Temp from "./components/Dashboard/TempDash";
// import OverviewPage from "./pages/OverviewPage";
// import Sidebar from "./components/common/Sidebar";
// // protect routes that require authentication
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, user } = useAuthStore();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!user.isVerified) {
//     return <Navigate to="/verify-email" replace />;
//   }

//   return children;
// };

// // redirect authenticated users to the home page
// const RedirectAuthenticatedUser = ({ children }) => {
//   const { isAuthenticated, user } = useAuthStore();

//   if (isAuthenticated && user.isVerified) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// function App() {
//   const { isCheckingAuth, checkAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   // if (isCheckingAuth) return <LoadingSpinner />;

//   return (
//     <div>


//       <Routes>

//         <Route
//           path="/"
//           element={

//             <ProtectedRoute>
//               <OverviewPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/signup"
//           element={
//             <RedirectAuthenticatedUser>
//               <SignUpPage2 />
//             </RedirectAuthenticatedUser>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <RedirectAuthenticatedUser>
//               <LoginPage2 />
//             </RedirectAuthenticatedUser>
//           }
//         />
//         <Route path="/verify-email" element={<EmailVerificationPage2 />} />
//         <Route
//           path="/forgot-password"
//           element={
//             <RedirectAuthenticatedUser>
//               <ForgotPasswordPage />
//             </RedirectAuthenticatedUser>
//           }
//         />

//         <Route
//           path="/reset-password/:token"
//           element={
//             <RedirectAuthenticatedUser>
//               <ResetPassword />
//             </RedirectAuthenticatedUser>
//           }
//         />
//         <Route path='/' element={<OverviewPage />} />
//         {/* catch all routes */}
//         <Route path="" element={<Navigate to="/" replace />} />
//         <Route path="/uptime-dashboard" element={<Dashboard />} />
//         <Route path="/create-uptime-check" element={<CreateUptimeCheck />} />
//         <Route path="/dashboard" element={<Temp />} />
//       </Routes>
//       <Toaster />
//     </div>
//   );
// }

// export default App;

// import { Navigate, Route, Routes } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { useAuthStore } from "./store/authStore";
// import { useEffect } from "react";
// import Sidebar from "./components/common/Sidebar"; // Import Sidebar directly
// import OverviewPage from "./pages/OverviewPage";
// import LoginPage2 from "./pages/LoginPage2";
// import ResetPassword from "./pages/ResetPassword";
// import SignUpPage2 from "./pages/SignUpPage2";
// import EmailVerificationPage2 from "./pages/EmailVerificationPage2";
// import CreateUptimeCheck from "./components/Dashboard/CreateUptimeCheck";
// import Dashboard from "./components/Dashboard/Dashboard";
// import Temp from "./components/Dashboard/TempDash";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import ProductsPage from "./pages/ProductsPage";
// // Protect routes that require authentication
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, user } = useAuthStore();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!user.isVerified) {
//     return <Navigate to="/verify-email" replace />;
//   }

//   return children;
// };

// // Redirect authenticated users to the home page
// const RedirectAuthenticatedUser = ({ children }) => {
//   const { isAuthenticated, user } = useAuthStore();

//   if (isAuthenticated && user.isVerified) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// function App() {
//   const { isCheckingAuth, checkAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   return (
// 		<div className='flex h-screen bg-[#282c31] text-gray-100 overflow-hidden'>
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main content area */}
//       <div className="flex-1 bg-gray overflow-y-auto">
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <OverviewPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/products"
//             element={
//               <ProtectedRoute>
//                 <ProductsPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/signup"
//             element={
//               <RedirectAuthenticatedUser>
//                 <SignUpPage2 />
//               </RedirectAuthenticatedUser>
//             }
//           />
//           <Route
//             path="/login"
//             element={
//               <RedirectAuthenticatedUser>
//                 <LoginPage2 />
//               </RedirectAuthenticatedUser>
//             }
//           />
//           <Route path="/verify-email" element={<EmailVerificationPage2 />} />
//           <Route
//             path="/forgot-password"
//             element={
//               <RedirectAuthenticatedUser>
//                 <ForgotPasswordPage />
//               </RedirectAuthenticatedUser>
//             }
//           />
//           <Route
//             path="/reset-password/:token"
//             element={
//               <RedirectAuthenticatedUser>
//                 <ResetPassword />
//               </RedirectAuthenticatedUser>
//             }
//           />

//           {/* Sidebar pages */}
//           <Route
//             path="/uptime-dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/create-uptime-check"
//             element={
//               <ProtectedRoute>
//                 <CreateUptimeCheck />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Temp />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </div>

//       <Toaster />
//     </div>
//   );
// }

// export default App;



import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import Sidebar from "./components/common/Sidebar"; // Import Sidebar directly
import OverviewPage from "./pages/OverviewPage";
import LoginPage2 from "./pages/LoginPage2";
import ResetPassword from "./pages/ResetPassword";
import SignUpPage2 from "./pages/SignUpPage2";
import EmailVerificationPage2 from "./pages/EmailVerificationPage2";
import CreateUptimeCheck from "./components/Dashboard/CreateUptimeCheck";
import Dashboard from "./components/Dashboard/Dashboard";
import Temp from "./components/Dashboard/TempDash";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProductsPage from "./pages/ProductsPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// Redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const location = useLocation(); // Get the current location/path

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Define paths where Sidebar should not be visible
  const hideSidebarPaths = ["/login", "/signup", "/forgot-password", "/reset-password/:token"];

  return (
    <div className='flex h-screen bg-[#282c31] text-gray-100 overflow-hidden'>
      {/* Conditionally render the Sidebar based on the current path */}
      {!hideSidebarPaths.includes(location.pathname) && <Sidebar />}

      {/* Main content area */}
      <div className="flex-1 bg-[#1E2125] overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <OverviewPage />

              </ProtectedRoute>
            }
          />
          <Route
            path="/azure-detailed-metrics"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/azure-audit-report"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
  


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Temp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage2 />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage2 />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage2 />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPassword />
              </RedirectAuthenticatedUser>
            }
          />


        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;