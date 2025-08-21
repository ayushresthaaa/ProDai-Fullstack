import { Login } from "./features/authentication/login/login";
import { Register } from "./features/authentication/register/register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Profile } from "./features/profile/profile";
import { ProfileForm } from "./features/profile/profileEditForm/ProfileForm";
import { Home } from "./features/home/home";
// import Navbar from "./components/ui/navbar/Navbar";
import "./index.css";
import { AuthGuard } from "./shared/guards/AuthGuard";
import { PageGuard } from "./shared/guards/PageGuard";
import { Explore } from "./features/explore/explore";
import { ChangeCred } from "./features/credential_config/changeCred";
function App() {
  return (
    <Router>
      <Routes>
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
              <Profile />
            </AuthGuard>
          }
        />
        <Route
          path="/profileEdit"
          element={
            <AuthGuard>
              <ProfileForm />
            </AuthGuard>
          }
        />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/explore"
          element={
            <AuthGuard>
              <Explore />
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
      </Routes>
    </Router>
  );
}

export default App;
