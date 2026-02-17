import { TaskBoard } from "../types/types";
import { pool } from "./connect";

export const addTaskBoard = async (taskBoard: TaskBoard) => {
  try {
    const q = `INSERT INTO "taskboards" (id,userid,name) VALUES($1, $2, $3) RETURNING *  `;
    const values = [taskBoard.id, taskBoard.userId, taskBoard.name];
    const res = await pool.query(q, values);
    if (!res || !res.rows || res.rows.length === 0) {
      throw new Error("Something went wrong while creating a new task board");
    }
    return "Successfully created a new board";
  } catch (err: any) {
    if (!err) {
      throw new Error(
        "Something went wrong while trying to create a new task board"
      );
    }
    throw new Error(err.message);
  }
};

export const getTaskBoardByUserId = async (userId: string) => {
  try {
    const q = `SELECT * FROM "taskboards" WHERE userid = $1`;
    const values = [userId];
    const res = await pool.query(q, values);
    if (!res || !res.rows || res.rows.length === 0) {
      throw new Error("Something went wrong while fetching task boards");
    }
    return res.rows;
  } catch (err: any) {
    if (!err) {
      throw new Error(
        "Something went wrong while trying to fetch the task boards"
      );
    }
    throw new Error(err.message);
  }
};

export const getTaskBoardCount = async (userId: string) => {
  try {
    const q = `SELECT count(*) FROM "taskboards" WHERE userid = $1`;
    const values = [userId];
    const res = await pool.query(q, values);
    if (!res || !res.rows || res.rows.length === 0 || !res.rows[0].count) {
      throw new Error("Something went wrong while counting task boards");
    }
    return res.rows[0].count;
  } catch (err: any) {
    if (!err) {
      throw new Error(
        "Something went wrong while trying to count the task boards"
      );
    }
    throw new Error(err.message);
  }
};
