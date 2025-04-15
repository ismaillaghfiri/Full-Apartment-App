import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Projects from "./pages/projects/Projects";
import ProjectDetails from "./pages/projects/ProjectDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import NewProject from "./pages/admin/NewProject";
import EditProject from "./pages/admin/EditProject";
import AdminResponsables from "./pages/admin/AdminResponsables";
import NewResponsable from "./pages/admin/NewResponsable";
import EditResponsable from "./pages/admin/EditResponsable";
import ResponsableLayout from "./components/ResponsableLayout";
import ResponsableProjects from "./pages/responsable/ResponsableProjects";
import ViewProject from "./pages/responsable/ViewProject";
import ResponsableVisits from "./pages/responsable/ResponsableVisits";
import { useAuth } from "./contexts/AuthContext";
import NewVisit from "./pages/responsable/NewVisit";
import EditVisit from "./pages/responsable/EditVisit";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

const AppRoutes = () => {
  interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
  }

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    roles,
  }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user?.role || "")) {
      return <Navigate to="/" />;
    }

    return <>{children}</>;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects/new"
        element={
          <ProtectedRoute roles={["admin"]}>
            <NewProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects/:id/edit"
        element={
          <ProtectedRoute roles={["admin"]}>
            <EditProject />
          </ProtectedRoute>
        }
      />

      {/* Responsable Management Routes */}
      <Route
        path="/admin/responsables"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminResponsables />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/responsables/new"
        element={
          <ProtectedRoute roles={["admin"]}>
            <NewResponsable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/responsables/:id/edit"
        element={
          <ProtectedRoute roles={["admin"]}>
            <EditResponsable />
          </ProtectedRoute>
        }
      />

      {/* Responsable Routes */}
      <Route
        path="/responsable"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <ResponsableLayout>
              <ResponsableProjects />
            </ResponsableLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsable/projects"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <ResponsableLayout>
              <ResponsableProjects />
            </ResponsableLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsable/projects/:id/edit"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <ViewProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsable/visits"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <ResponsableVisits />
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsable/visits/new"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <NewVisit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsable/visits/:id/edit"
        element={
          <ProtectedRoute roles={["responsable"]}>
            <EditVisit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
