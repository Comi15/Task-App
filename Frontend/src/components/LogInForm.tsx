import "../styles/signInForm.css";
import { LoginDto } from "../types/types";
import { useContext, useState } from "react";
import { authContext } from "../contexts/authContextProvider";
import { emailIcon, passwordIcon } from "./Icons";
const formStartingData = {
  email: "",
  password: "",
};

type LoginFormProps = {
  children:React.ReactNode
}
const LogInForm = ({children}:LoginFormProps) => {
  const { logIn } = useContext(authContext);

  const [formData, setFormData] = useState<LoginDto>(formStartingData);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    logIn(formData);
  };
   
  return (
    <>
      {/* <NavBar /> */}
      <div className="sign-in-container">
        <form className="log-in-form" onSubmit={handleSubmit}>
          {children}
          <label>Email</label>
          <div className="input-div">
            <input
              onChange={handleChange}
              required
              type="email"
              name="email"
              placeholder="example@gmail.com"
            />
            {emailIcon}
          </div>
          <label>Password</label>
          <div className="input-div">
            <input
              onChange={handleChange}
              required
              type="password"
              name="password"
              placeholder="*******"
            />
            {passwordIcon}
          </div>
          <button className="sign-in-btn" type="submit">Sign in</button>
        </form>
      </div>
    </>
  );
};

export default LogInForm;
