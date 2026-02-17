// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import { handleErrors } from "../Helpers/errorHandleHelper";
// dotenv.config();
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_ADDRESS,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// export const sendEmail = (text: string, recieverEmail: string) => {
//   try {
//     transporter.sendMail({
//       from: {
//         name: "Admin",
//         address: process.env.EMAIL_ADDRESS as string,
//       }, // sender address
//       to: recieverEmail, // list of receivers
//       subject: "Update about your tasks", // Subject line
//       text: text, // plain text body
//       html: `<b>${text}</b>`, // html body
//     });
//   } catch (err) {
//     const errMessage = handleErrors(err);
//     throw new Error(errMessage);
//   }
// };

// export const sendEmailLink = (link:string,text: string, recieverEmail: string) => {
//   try {
//     transporter.sendMail({
//       from: {
//         name: "Admin",
//         address: process.env.EMAIL_ADDRESS as string,
//       }, // sender address
//       to: recieverEmail, // list of receivers
//       subject: "Update about your tasks", // Subject line
//       text: text, // plain text body
//       html: `<a href = ${link}>${text}</a>`, // html body
//     });
//   } catch (err) {
//     const errMessage = handleErrors(err);
//     throw new Error(errMessage);
//   }
// };