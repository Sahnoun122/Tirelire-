import { sendTestEmail } from "../services/notification.service.js";

export const manualNotificationTest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "L'email est requis !" });
    }

    await sendTestEmail(email);

    res.json({ message: "Email de test envoyé avec succès !" });
  } catch (error) {
    console.error("Erreur test notification:", error.message);
    res.status(500).json({ error: "Erreur lors de l'envoi du test" });
  }
};
