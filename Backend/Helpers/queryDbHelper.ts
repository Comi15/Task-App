import { FilterData } from "../types/types";

export const generateFilterQuery = (data: FilterData) => {
  const { priorities, startDate, endDate, userId, taskBoardId, searchQuery } =
    data;
  console.log(priorities);
  console.log(searchQuery);
  //Ako su sva tri falsy vratice da nema poklapanja za filter
  if (!startDate || !endDate) {
    return {
      values: [priorities, userId, taskBoardId, searchQuery],
      query: `SELECT id,userId,title,description,priority,status, to_char(duedate,'YYYY-MM-DD') As "duedate" FROM tasks WHERE (array_length($1::text[],1) IS NULL OR priority = ANY($1)) AND userid = $2 AND boardid = $3 AND($4::text IS NULL OR title ILIKE '%' || $2 || '%')`,
    };
  }
  return {
    values: [priorities, startDate, endDate, userId, taskBoardId, searchQuery],
    query: `SELECT id,userId,title,description,priority,status, to_char(duedate,'YYYY-MM-DD') As "duedate" FROM tasks WHERE (array_length($1::text[],1) IS NULL OR priority = ANY($1)) AND duedate BETWEEN $2 AND $3 AND userid = $4 AND boardid = $5 AND ($6::text IS NULL OR title ILIKE '%' || $6 || '%' )`,
  };
};
