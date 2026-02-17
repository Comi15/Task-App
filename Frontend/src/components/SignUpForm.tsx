import "../styles/registerForm.css";
import { useState } from "react";
import { validate } from "../helpers/authHelper";
import { doRegister } from "../Services/authService";
import toast from "react-hot-toast";
import { Role, User } from "../types/types";
import { emailIcon, passwordIcon, usernameIcon } from "./Icons";
import LogInForm from "./LogInForm";
import SingUpInButton from "./SignUpInButton";

const fromStartingData = {
  email: "",
  username: "",
  password: "",
  name: "",
  lastName: "",
  role: Role.Normal,
};

const SignUpForm = () => {

  const [formData, setFormData] = useState<User>(fromStartingData);
  const [passErr, setPassErr] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passErr) {
      const registerData = await doRegister(formData);
      if (registerData.errMessage) {
        toast.error(registerData.errMessage);
        return;
      }

      toast.success(registerData.data as string);
      setIsSignUp(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "password") {
      const passStr = validate(value);
      if (!passStr) {
        return setPassErr("Your password is not strong enough!");
      }
      setPassErr("");
    }
  };

  const handleIsSignedInUp = (value: boolean) => {
    setIsSignUp(value);
  };
  return (
    <>
      {/* <NavBar /> */}

      <div className="sign-up-container">
        <div className="register-img-container"></div>
        <div className="sign-up-box">
          {isSignUp ? (
            <form onSubmit={handleSubmit} className="sign-up-inputs-container">
              <SingUpInButton
                isSignUp={isSignUp}
                setSingUpInButtonUpdated={handleIsSignedInUp}
              />
              <label>Email</label>
              <div className="input-div">
                <input
                  onChange={handleChange}
                  required
                  name="email"
                  placeholder="example@gmail.com"
                  type="email"
                />
                {emailIcon}
              </div>
              <label>Username</label>
              <div className="input-div">
                <input
                  onChange={handleChange}
                  required
                  name="username"
                  placeholder="John123"
                  type="text"
                />
                {usernameIcon}
              </div>
              <label>Password</label>
              <div className="input-div">
                <input
                  id="password"
                  onChange={handleChange}
                  required
                  name="password"
                  placeholder="********"
                  type="password"
                />
                {passwordIcon}
                {passErr && (
                  <p style={{ color: "#8E1616", padding: "10px 0px" }}>
                    {passErr}
                  </p>
                )}
                <div className="pass-input-instructions">
                  <p>Password must contain at least 8 characters</p>
                  <p>Password must contain at least 1 uppercase letter</p>
                  <p>Password must contain a number</p>
                  <p>Password must contain a symbol</p>
                </div>
              </div>
              <label>First name</label>
              <input
                onChange={handleChange}
                required
                name="name"
                placeholder="John"
                type="text"
              />
              <label>Last name</label>
              <input
                onChange={handleChange}
                required
                name="lastName"
                placeholder="Doe"
                type="text"
              />
              <label>User type</label>
              <select
                onChange={handleChange}
                name="role"
                id="role"
                className="register-select"
              >
                <option value={Role.Normal}>Normal</option>
                <option value={Role.Premium}>Premium</option>
              </select>
              <button className="submit-btn" type="submit">
                Sign up
              </button>
            </form>
          ) : (
            <>
              <LogInForm>
                <SingUpInButton
                  isSignUp={isSignUp}
                  setSingUpInButtonUpdated={handleIsSignedInUp}
                />
              </LogInForm>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
