import { Login } from "./features/authentication/login/login";
import { Register } from "./features/authentication/register/register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Profile } from "./features/profile/profile";
import { ProfileForm } from "./features/profile/profileEditForm/ProfileForm";
import { Home } from "./features/home/home";
// import Navbar from "./components/ui/navbar/Navbar";
import "./index.css";
import { ErrorPage } from "./components/ui/error page/error";
import { AuthGuard } from "./shared/guards/AuthGuard";
import { PageGuard } from "./shared/guards/PageGuard";
import { RoleGuard } from "./shared/guards/RoleGuard";
import { Explore } from "./features/explore/explore";
import { ChangeCred } from "./features/credential_config/changeCred";
import { ViewProfile } from "./features/profile/viewProfile/viewProfile";
import { ProfileGuard } from "./shared/guards/SetupGuard";
import { AIRecommendation } from "./features/ai_recommendation/ai_recommendation";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageGuard>
              <Login />
            </PageGuard>
          }
        />
        <Route
          path="/login"
          element={
            <PageGuard>
              <Login />
            </PageGuard>
          }
        />
        <Route
          path="/register"
          element={
            <PageGuard>
              <Register />
            </PageGuard>
          }
        />

        <Route
          path="/profile"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={["professional"]}>
                <ProfileGuard>
                  <Profile />
                </ProfileGuard>
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/recommendation"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={["professional"]}>
                <ProfileGuard>
                  <AIRecommendation />
                </ProfileGuard>
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/getprofile/:userId"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={["user"]}>
                <ViewProfile />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/profileEdit"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={["professional"]}>
                <ProfileForm />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={["user"]}>
                <Home />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/explore"
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={["user"]}>
                <Explore />
              </RoleGuard>
            </AuthGuard>
          }
        />
        <Route
          path="/configCredentials"
          element={
            <AuthGuard>
              <ChangeCred />
            </AuthGuard>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
