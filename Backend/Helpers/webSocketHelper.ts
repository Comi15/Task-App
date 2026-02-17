import * as cookie from "cookie";
import { COOKIE_NAME } from "../Services/authService";
import jwt from "jsonwebtoken";

export const getJwtFromCookies = (socket: any) => {
  try {
    const cookieString = socket.handshake.headers.cookie;
    if (!cookieString) {
      throw new Error("No cookies in the header");
    }

    const parsedCookies = cookie.parse(cookieString);
    if (!parsedCookies) {
      throw new Error("Could not parse the cookies");
    }

    return parsedCookies[COOKIE_NAME];
  } catch (err: any) {
    if (!err) {
      throw new Error("Something went wrong, couldn't get jwt from cookie");
    }
    throw new Error("Something went wrong, couldn't get jwt from cookie")
  }
};

export const verifyTokenWS = (token: string) => {
  try {
    jwt.verify(token, process.env.TOKEN_KEY as string);
    return true;
  } catch (error) {
    return false;
  }
};
