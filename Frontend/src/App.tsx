import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./contexts/authContextProvider";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SendResetLinkForm from "./components/SendResetLinkForm";
import ResetPasswordForm from "./components/ResetPasswordForm";

function App() {
  return (
    <>
      <UserProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<SignUpForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignUpForm />} />
          <Route path="/dashboard" element={<ProtectedRoute Component ={Dashboard}/>} />
          <Route path="/reset" element={<SendResetLinkForm />} />
          <Route path="/new-password" element={<ResetPasswordForm />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
