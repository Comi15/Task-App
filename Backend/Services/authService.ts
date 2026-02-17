import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import express from "express";
import { getUserByEmail, addUser, updateUserPassword } from "../database/usersRepo";
import {
  CurrentUser,
  User,
  ReturnType,
  ResetPasswordData,
} from "../types/types";
import dotenv from "dotenv";
import { generateToken, hashPassword } from "../Helpers/authHelper";
import { doAddTaskBoard } from "./taskBoardService";
//import { sendEmail, sendEmailLink } from "./emailService";
import { handleErrors } from "../Helpers/errorHandleHelper";

dotenv.config();
export const COOKIE_NAME = "accessToken";

export const doRegister = async (
  req: express.Request
): Promise<ReturnType<String>> => {
  try {
    const { email, username, password, name, lastName, role } = req.body;
    //Provera da li vec postoji korisnik sa datim email-om
    // const existingUser = await getUserByEmail(email);
    // if (!(existingUser instanceof Error)) {
    //   return {
    //     httpStatusCode: 400,
    //     errMessage: "User with the given e-mail is already registered",
    //   };
    // }
    //id generisem ostala polja uzimam iz req.body
    const id: string = uuidv4();
    const passwordHashed: string = await hashPassword(password);
    const userToBeSaved = {
      id: id,
      email: email,
      username: username,
      password: passwordHashed,
      name: name,
      lastName: lastName,
      role: role,
    };

    const addedUser = await addUser(userToBeSaved);
    if (!addedUser) {
      throw new Error(
        "Server error, something wrong with adding the user to the db"
      );
    }

    const firstTaskBoardId: string = uuidv4();
    await doAddTaskBoard({
      id: firstTaskBoardId,
      name: "first task board",
      userId: id,
    });

    const returnData = addedUser as string;
    return { data: returnData, httpStatusCode: 200 };
  } catch (err: any) {
    return { httpStatusCode: 500, errMessage: err.message };
  }
};

export const doLogin = async (
  req: express.Request
): Promise<ReturnType<CurrentUser | null>> => {
  const { email, password } = req.body;
  try {
    const currentUser = await getUserByEmail(email);
    if (!currentUser) {
      return {
        errMessage: "User with the given email couldn't be found",
        httpStatusCode: 404,
      };
    }

    if (currentUser instanceof Error) {
      return { httpStatusCode: 404, errMessage: currentUser.message };
    }

    const checkPassword = bcrypt.compareSync(password, currentUser.password);
    if (!checkPassword) {
      return { httpStatusCode: 401, errMessage: "Wrong email or password" };
    }
    const { password: pass, ...others } = currentUser;
    const token = generateToken(currentUser);

    return { data: others, httpStatusCode: 200, token: token };
  } catch (err: any) {
    return { errMessage: err.message, httpStatusCode: 500 };
  }
};

// export const doSendResetMail = (email: string) => {
//   try {
//     sendEmailLink(
//       process.env.RESET_PASS_LINK as string,
//       "Link for reset",
//       email
//     );
//   } catch (err: any) {
//     const errMessage = handleErrors(err);
//     throw new Error(errMessage);
//   }
// };

export const doUpdateUserPassword = async (
  updateData: ResetPasswordData
): Promise<ReturnType<String>> => {
  const { email, password } = updateData;
  try {
    const currentUser = await getUserByEmail(email);
    if (!currentUser) {
      return {
        errMessage: "User with the given email couldn't be found",
        httpStatusCode: 404,
      };
    }

    const passwordHashed: string = await hashPassword(password);

    const passwordUpdated = await updateUserPassword(email,passwordHashed);
    if(!passwordUpdated){
      return {
        errMessage: "Something went wrong couldn't update the password",
        httpStatusCode: 500,
      };
    }

    return {httpStatusCode:200,data:passwordUpdated as string}


  } catch (err: any) {
    const errMessage = handleErrors(err);
    throw new Error(errMessage);
  }
};
