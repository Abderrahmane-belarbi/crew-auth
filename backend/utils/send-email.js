import { transporter } from "../config/mailer.js";

export async function sendEmail({ to, subject, text, html }) {
  const sendMailPromise = transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  const timeoutMs = Number(process.env.SMTP_SEND_TIMEOUT_MS || 10_000);

  return Promise.race([
    sendMailPromise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`SMTP send timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    }),
  ]);
}
