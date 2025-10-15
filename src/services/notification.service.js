import cron from "node-cron";
import nodemailer from "nodemailer";
import Contribution from "../models/contribution.model.js";
import User from "../models/user.model.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendReminderEmail = async (user, missedCount) => {
  const mailOptions = {
    from: `"Tirelire" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Rappel de contribution manquée",
    text: `Salut ${user.firstName}, 
Tu as oublié de faire ${missedCount} contribution(s). Pense à régulariser ta participation. 😊`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email de rappel envoyé à ${user.email}`);
};

cron.schedule("0 9 * * *", async () => {
  console.log("Vérification des contributions en retard...");

  const today = new Date();
  const users = await User.find();

  for (const user of users) {
    const missedContributions = await Contribution.find({
      user: user._id,
      dueDate: { $lt: today },
      status: "pending",
    });

    if (missedContributions.length > 0) {
      await sendReminderEmail(user, missedContributions.length);
    }
  }

  console.log("Vérification terminée.");
});
