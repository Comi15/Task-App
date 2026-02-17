import { useState } from "react";
import "../styles/sendResetLinkForm.css";
import NavBar from "./NavBar";
import { doSendResetMail } from "../Services/authService";
import toast from "react-hot-toast";
const SendResetLinkForm = () => {
    const [email,setEmail] = useState('')
    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {data,errMessage} = await doSendResetMail(email);
        if(!data && !errMessage){
            toast.error("Couldn't send the mail");
            return;
        }
        if(errMessage){
            toast.error(errMessage);
            return;
        }
    }
  return (
    <>
      <NavBar />
      <div className="reset-container">
        <form onSubmit={handleSubmit} className="email-pass-reset-form">
          <label> Enter your email : </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@gmail.com" required />
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </>
  );
};

export default SendResetLinkForm;
