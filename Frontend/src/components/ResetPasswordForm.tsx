import { emailIcon, passwordIcon } from "./Icons";
import "../styles/signInForm.css";
import NavBar from "./NavBar";
import { LoginDto } from "../types/types";
import { useState } from "react";
import { doResetPassword } from "../Services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const formStartingData = {
  email: "",
  password: "",
};
const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginDto>(formStartingData);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, errMessage } = await doResetPassword(formData);
    if (!data && !errMessage) {
      toast.error("Something went wrong could not reset the password");
      return;
    }
    if (errMessage) {
      toast.error(errMessage);
      return;
    }
    toast.success("Password reseted successfully");
    navigate("/signin");
  };
  return (
    <>
      <NavBar />
      <div className="sign-in-container">
        <form className="log-in-form" onSubmit={handleSubmit}>
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
          <label> New password</label>
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
          <button type="submit">Reset password</button>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordForm;
