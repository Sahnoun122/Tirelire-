import User from "../models/user.model.js";
import Group from "../models/group.model.js";

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("members.user", "firstName lastName email reliability_score")
      .populate("rounds.beneficiary", "firstName lastName email"); 

    res.status(200).json({
      message: " Liste complète des groupes",
      total: groups.length,
      groups,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error });
  }
};

export const sendMessageToUser = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    if (!user.messages) user.messages = [];
    user.messages.push({
      from: "admin",
      content: message,
      date: new Date(),
    });

    await user.save();

    res.status(200).json({
      message: " Message envoyé avec succès à l'utilisateur",
      to: user.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l’envoi du message", error });
  }
};
