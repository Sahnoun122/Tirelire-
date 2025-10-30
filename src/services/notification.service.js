import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendNotificationEmail = async (to, subject, message) => {
  const mailOptions = {
    from: `"Tirelire" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email envoyé à ${to}`);
};

export const sendTestEmail = async (email) => {
  await sendNotificationEmail(
    email,
    " Test Notification Tirelire",
    "Ceci est un test de notification depuis Tirelire "
  );
};

cron.schedule("* * * * *", async () => {
  try {
    const email = process.env.EMAIL_USER; 
    await sendNotificationEmail(
      email,
      "⏰ Rappel automatique Tirelire",
      "N'oublie pas ta contribution d'aujourd'hui 💰"
    );
    console.log("Notification automatique envoyée !");
  } catch (error) {
    console.error("Erreur notification automatique:", error.message);
  }
});
