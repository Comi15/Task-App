import { pool } from "./connect";
import { User } from "../types/types";
import { handleErrors } from "../Helpers/errorHandleHelper";

export const getUserByEmail = async (email: string) => {
  try {
    const q = "SELECT * FROM users where email = $1";

    const result = await pool.query(q, [email]);
    if (!result || !result.rows) {
      throw new Error("Couldn't retrieve values from the database");
    }
    if (!result.rows[0]) {
      throw new Error("User with the given email doesn't exist");
    }
    return result.rows[0];
  } catch (err:any) {
    const errMessage = handleErrors(err);
    throw new Error(errMessage);
  }
};

export const addUser = async (user: User) => {
  try {
    const q =
      "INSERT INTO users (id,username,password,email,name,lastname,role) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *";

    const result = await pool.query(q, [
      user.id,
      user.username,
      user.password,
      user.email,
      user.name,
      user.lastName,
      user.role,
    ]);
    if (!result.rows[0] || !result || !result.rows) {
      throw new Error("Couldn't add the user, please try again.");
    }
    return "User added successfully.";
  } catch (err: any) {
    const errMessage = handleErrors(err);
    throw new Error(errMessage);
  }
};

export const getUserRoleByUserId = async (userId: string) => {
  try {
    const q = "SELECT role FROM users where id = $1";

    const result = await pool.query(q, [userId]);
    if (!result || !result.rows) {
      throw new Error("Couldn't retrieve values from the database");
    }
    if (!result.rows[0].role) {
      throw new Error("User with the given id doesn't exist");
    }
    return result.rows[0].role;
  } catch (err: any) {
    const errMessage = handleErrors(err);
    throw new Error(errMessage);
  }
};

export const updateUserPassword = async (email: string, password: string) => {
  try {
    const q = `UPDATE users SET password = $1 WHERE email = $2 RETURNING *`;
    const values = [password,email]
    const result = await pool.query(q, values);
    if (!result || !result.rows || result.rows.length === 0) {
      throw new Error("Couldn't retrieve values from the database");
    }
    return "Password changed successfully";
  } catch (err: any) {
    const errMessage = handleErrors(err);
    throw new Error(errMessage);
  }
};
