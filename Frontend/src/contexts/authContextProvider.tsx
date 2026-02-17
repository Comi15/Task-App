import { createContext } from "react";
import { authContextType, LoginDto } from "../types/types";
import { useState, useEffect } from "react";
import { doLogin, doLogOut } from "../Services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const contextInitialValues = {
  currentUser: null,
  logIn: () => null,
  logOut: () => null,
};
export const authContext = createContext<authContextType>(contextInitialValues);

type Props = {
  children: React.ReactNode;
};
export const UserProvider = (props: Props) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") as string) || null,
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const logIn = async (formData: LoginDto) => {
    const logInData = await doLogin(formData);
    if (logInData.errMessage) {
      toast.error(logInData.errMessage);
      return;
    }
    setCurrentUser(logInData.data);
    toast.success("Successfully logged in! Congrats!");
    navigate("/dashboard");
  };

  const logOut = async () => {
    const logOutData = await doLogOut();
    if (logOutData.errMessage) {
      toast.error(logOutData.errMessage);
      return;
    }
    setCurrentUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };
  return (
    <authContext.Provider value={{ currentUser, logIn, logOut }}>
      {props.children}
    </authContext.Provider>
  );
};
