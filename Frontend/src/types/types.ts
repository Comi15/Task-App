export type User = {
  email: string;
  username: string;
  password: string;
  name: string;
  lastName: string;
  role:Role
};

export type LoginDto = {
  email: string;
  password: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  username: string;
  name: string;
  lastName: string;
};

export type authContextType = {
  currentUser: CurrentUser | null;
  logIn: (data: LoginDto) => void;
  logOut: () => void;
};

export type ReturnData<T> = {
  data?:T;
  errMessage?:string;
  dataArray?:T[];
}
export type Task = {
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  status: Status;
  duedate?:string;
  userid?:string;
  boardId?:string;
};
export type TaskReturn = Task & {
  id:string;
}
export type TaskUpdate = Omit<TaskReturn,"userId"> & {
  userEmail:string;
}
export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}
export enum Status {
  ToDo= "To Do",
  InProgress = "In Progress",
  QA = "QA",
  Done = "Done",
}
export enum Role{
  Normal ="Normal",
  Premium = "Premium"
}
export type FilterData ={
  priorities?:Array<string>;
  startDate?:string;
  endDate?:string;
  userId:string;
  taskBoardId:string;
  searchQuery:string;
}

export type MinMaxDate = {
  mindate:string;
  maxdate:string
}

export type StatusUpdate = {
  taskId:string;
  status:Status;
  userEmail:string;
}

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  status:Status;
}

export type TaskBoard = {
  id?:string;
  name:string;
  userId:string;
}