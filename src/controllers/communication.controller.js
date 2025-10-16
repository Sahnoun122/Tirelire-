import Message from "../models/message.model.js";
import Group from "../models/group.model.js";

export const sendMessage = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Body vide" });
    }

    const { content, type } = req.body;
    const sender = req.user.id;

    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Groupe introuvable" });

    if (!group.members.some(m => m.user.toString() === sender)) {
      return res.status(403).json({ message: "Tu ne fais pas partie de ce groupe" });
    }

    const newMessage = new Message({
      group: group._id,
      sender,
      content,
      type: type || "text",
      timestamp: new Date(),
    });

    await newMessage.save();

    return res.status(201).json({
      message: "Message envoyé avec succès",
      data: newMessage,
    });
  } catch (error) {
    console.error("Erreur lors de l’envoi du message :", error);
    return res.status(500).json({ message: "Erreur lors de l’envoi du message", error });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.find({ group: groupId })
      .populate("sender", "name email")
      .sort({ timestamp: 1 });

    return res.status(200).json({
      message: "Messages récupérés avec succès",
      data: messages,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des messages", error });
  }
};
