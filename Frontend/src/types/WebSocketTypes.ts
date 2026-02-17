import { TaskUpdate } from "./types";

export interface ServerToClientEvents {
   updateError: (errorMsg:string) => void
   updateSuccess: (succesMsg:string) => void
   dueDateState:(msg:string) => void
  }
  
  export interface ClientToServerEvents {
    updateData: (editData:TaskUpdate) => void;
    checkDueDate:(userEmail:string) => void;
  }