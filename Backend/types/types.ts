export type User = {
  id: string;
  email: string;
  username: string;
  password: string;
  name: string;
  lastName: string;
  role:Role;
};
export type CurrentUser = {
  id: string;
  email: string;
  username: string;
  name: string;
  lastName: string;
  token: string;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
  status: Status;
  duedate?:string;
  userEmail?:string;
  boardId?:string;
};

export enum Priority {
  High,
  Medium,
  Low,
}
export enum Status {
  ToDo,
  InProgress,
  QA,
  Done,
}
export enum Role {
  Normal = "Normal",
  Premium = "Premium"
}

export type ReturnType<T> = {
  data?: T;
  dataArray?: T[];
  errMessage?: string;
  httpStatusCode: number;
  token?: string;
};

export type FilterData = {
  priorities?:Array<string>;
  startDate?:string;
  endDate?:string;
  userId:string;
  taskBoardId:string;
  searchQuery?:string;
}
export type MinMaxDate = {
  minDate:string;
  maxDate:string
}
export type StatusUpdate = {
  taskId:string;
  status:Status;
  userEmail:string;
}
export type TaskBoard = {
  id?:string;
  name:string;
  userId:string;
}

export type ResetPasswordData = {
  email:string;
  password:string;
}