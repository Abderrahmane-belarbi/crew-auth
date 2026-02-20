import { transporter } from "../config/mailer.js";

export async function sendEmail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}