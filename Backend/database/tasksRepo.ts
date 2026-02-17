import { pool } from "./connect";
import { FilterData, Task, StatusUpdate } from "../types/types";
import { generateFilterQuery } from "../Helpers/queryDbHelper";

export const addTaskDb = async (task: Task) => {
  try {
    const q =
      "INSERT INTO tasks (id,userid,title,description,priority,duedate,status,boardid) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *";

    const result = await pool.query(q, [
      task.id,
      task.userId,
      task.title,
      task.description,
      task.priority,
      task.dueDate,
      task.status,
      task.boardId,
    ]);
    if (!result || !result.rows || !result.rows[0]) {
      throw new Error("Something went wrong couldn't add the task");
    }
    return result.rows[0];
  } catch (err) {
    return err;
  }
};
export const getAllTasks = async () => {
  try {
    const q =
      "SELECT title,description,priority,status, to_char(duedate,'DD-MM-YYYY') As DATE FROM tasks ";
    const result = await pool.query(q);

    if (!result || !result.rows) {
      throw new Error("Couldn't retrieve the tasks");
    }
    return result.rows;
  } catch (err) {
    return err;
  }
};

export const getTasksByUserid = async (userId: string, taskBoardId: string) => {
  try {
    const q = `SELECT id,userId,title,description,priority,status, to_char(duedate,'YYYY-MM-DD') As "duedate" FROM tasks WHERE userid = $1 AND boardid = $2 ORDER BY id ASC`;
    const result = await pool.query(q, [userId, taskBoardId]);
    if (!result || !result.rows) {
      throw new Error("Couldn't retrieve the tasks");
    }
    return result.rows;
  } catch (err: any) {
    return err;
  }
};

export const updateTask = async (task: Task) => {
  try {
    const q =
      "UPDATE tasks SET title = $1, description = $2 ,duedate = $3, priority = $4, status = $5 WHERE id = $6 RETURNING title";
    const values = [
      task.title,
      task.description,
      task.duedate,
      task.priority,
      task.status,
      task.id,
    ];
    const res = await pool.query(q, values);
    if (!res || !res.rows || !res.rows[0] || !res.rows[0].title) {
      throw new Error("Could not update the task db");
    }
    return res.rows[0].title;
  } catch (err) {
    return err;
  }
};

export const getTaskById = async (taskId: string) => {
  try {
    const q = `SELECT title,description,priority,status, to_char(duedate,'YYYY-MM-DD') As "duedate" FROM tasks WHERE id = $1`;
    const values = [taskId];
    const res = await pool.query(q, values);
    if (!res || !res.rows) {
      throw new Error("Something went wrong, couldn not fetch the user");
    }
    if (!res.rows[0]) {
      throw new Error("Task with the given id does not exist");
    }
    return res.rows[0];
  } catch (err) {
    return err;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const query = {
      text: "DELETE FROM tasks WHERE id = $1 RETURNING *",
      values: [taskId],
    };
    const res = await pool.query(query);
    if (!res || !res.rows) {
      throw new Error("Something went wrong, couldn't delete the task");
    }
    if (!res.rows[0]) {
      throw new Error("Task with the given id doesn't exist in the DB");
    }
    return "Successfully deleted the task!";
  } catch (err: any) {
    if (!err) {
      throw new Error("Something went wrong while trying to delete the task!");
    }
    return err;
  }
};

export const filterTasks = async (filterData: FilterData) => {
  try {
    const { values, query } = generateFilterQuery(filterData);
    const res = await pool.query(query, values);
    if (!res || !res.rows) {
      throw new Error(
        "Something went wrong while filtering, didn't get a response from the db",
      );
    }
    // if (res.rows.length === 0) {
    //   throw new Error("No tasks match the filters");
    // }
    return res.rows;
  } catch (err) {
    if (!err) {
      throw new Error("Something went wrong while trying to search the task!");
    }
    return err;
  }
};

export const getMinMaxDate = async () => {
  try {
    const q = `SELECT to_char(min(duedate),'YYYY-MM-DD') as minDate, to_char(max(duedate),'YYYY-MM-DD')as maxDate from tasks;`;

    const res = await pool.query(q);
    if (!res || !res.rows || res.rows.length === 0) {
      throw new Error(
        "Something went wrong while finding the min and max date",
      );
    }

    return res.rows[0];
  } catch (err: any) {
    if (!err) {
      throw new Error(
        "Something went wrong while trying to fetch min and max dates!",
      );
    }
    return err;
  }
};

export const updateStatus = async (updateData: StatusUpdate) => {
  try {
    const q = `UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *`;
    const values = [updateData.status, updateData.taskId];
    const res = await pool.query(q, values);

    if (!res || !res.rows || res.rows.length === 0) {
      throw new Error("Something went wrong while updating the task state");
    }

    return ` ${res.rows[0].title} status has been updated successfully`;
  } catch (err: any) {
    if (!err) {
      throw new Error(
        "Something went wrong while trying to update the task status!",
      );
    }
    throw new Error(
      "Something went wrong while tryng to update the task status",
    );
  }
};
export const getNumberOfTasksByUser = async (
  userId: string,
  selectedBoardId: string,
) => {
  try {
    const q = `SELECT count(*) FROM tasks WHERE userid = $1 AND boardid = $2`;
    const values = [userId, selectedBoardId];
    const res = await pool.query(q, values);
    if (!res || !res.rows || res.rows.length === 0 || !res.rows[0].count) {
      throw new Error("Something went wrong while updating the task state");
    }
    return res.rows[0].count;
  } catch (err: any) {
    if (!err) {
      throw new Error(
        "Something went wrong while trying to update the task state",
      );
    }
    throw new Error(err.message);
  }
};

export const getNumberOfFinishedTasksByUser = async (
  userId: string,
  selectedBoardId: string,
) => {
  try {
    const q = `SELECT count(*) FROM tasks WHERE userid = $1 AND status = 'Done' AND boardid = $2`;
    const values = [userId, selectedBoardId];
    const res = await pool.query(q, values);
    if (!res || !res.rows || res.rows.length === 0 || !res.rows[0].count) {
      throw new Error("Something went wrong while updating the task state");
    }
    return res.rows[0].count;
  } catch (err: any) {
    if (!err) {
      throw new Error(
        "Something went wrong while trying to update the task state",
      );
    }
    throw new Error(err.message);
  }
};

export const getAllTaskDueDates = async () => {
  try {
    const q = `SELECT userid, duedate, title FROM tasks`;
    const res = await pool.query(q);
    if (!res || !res.rows || res.rows.length === 0) {
      throw new Error("Something went wrong while trying to get dueDates");
    }
    return res.rows;
  } catch (err: any) {
    if (!err) {
      throw new Error("Something went wrong while trying to get dueDates");
    }
    throw new Error(err.message);
  }
};

export const getUserEmailById = async (userId: string) => {
  try {
    const q = `SELECT email FROM users where id = $1`;
    const values = [userId];
    const res = await pool.query(q, values);
    if (!res || !res.rows || res.rows.length === 0) {
      throw new Error(
        "Something went wrong while fetching the user email by his id",
      );
    }
    return res.rows[0].email;
  } catch (err: any) {
    if (!err) {
      throw new Error(
        "Something went wrong while trying to fetch the user email",
      );
    }
    throw new Error(err.message);
  }
};
