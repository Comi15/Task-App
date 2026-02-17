import { getUserEmailById } from "../database/tasksRepo";
//import { sendEmail } from "../Services/emailService";

export const timeUntilDueDate = async (
  targetDate: Date,
  userId: string,
  taskTitle: string
) => {
  // Get the current date and time
  const now = new Date();

  // Calculate the difference in milliseconds
  const differenceInMs = targetDate.getTime() - now.getTime();

  const seconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days <= 1) {
    const userEmail = await getUserEmailById(userId);
    //sendEmail(`${taskTitle} is aproaching it's due date in a day`, userEmail);
  }
};
