import express from "express";
import { User } from "../types/types";
import { doLogin, doRegister, doUpdateUserPassword } from "../Services/authService";
import { handleErrors } from "../Helpers/errorHandleHelper";

export const COOKIE_NAME = "accessToken";
export const register = async (
  req: express.Request<{}, {}, User>,
  res: express.Response
) => {
  try {
    const returnValue = await doRegister(req);
    if (!returnValue) {
      return res.status(500).json("Something went wrong on the server");
    }
    if (returnValue.errMessage) {
      return res
        .status(returnValue.httpStatusCode)
        .json(returnValue.errMessage);
    }
    //everything ok
     res.status(returnValue.httpStatusCode).json(returnValue.data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const returnValue = await doLogin(req);
    if (returnValue.errMessage) {
      return res
        .status(returnValue.httpStatusCode)
        .json(returnValue.errMessage);
    }
    //everything ok
    res
      .cookie(COOKIE_NAME, returnValue.token, {
        httpOnly: true,
        secure: true,
      })
      .status(returnValue.httpStatusCode)
      .json(returnValue.data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    res
      .clearCookie(COOKIE_NAME, {
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json("User has been logged out.");
  } catch (err) {
    return res.status(500).json(err);
  }
};

// export const sendResetMail = async(req:express.Request,res:express.Response) => {
//   try {
//         const {email} = req.body;
//         if(!email){
//           return res.status(400).json("Couldn't get data from the body");
//         }
//         doSendResetMail(email);
//         return res.status(200).json("Email sent, check your inbox");
//   } catch (err:any) {
//     const errMessage = handleErrors(err)
//     res.status(500).json(errMessage);
//   }

// }

export const resetPassword = async(req:express.Request,res:express.Response) => {
  try{
    const {email,password} = req.body;
        if(!email || !password){
          return res.status(400).json("Couldn't get data from the body");
        }
        const passwordReseted = await doUpdateUserPassword({email,password});
        if(!passwordReseted){
          return res.status(500).json("Something went wrong on the server");
        }
        if(passwordReseted.errMessage){
          return res.status(passwordReseted.httpStatusCode).json(passwordReseted.errMessage);
        }

        res.status(passwordReseted.httpStatusCode).json(passwordReseted);

  }catch(err:any){
    const errMessage = handleErrors(err)
    res.status(500).json(errMessage);
  }
}