import Message from "../models/message.model.js";
import Group from "../models/group.model.js";
import TransactionLog from "../models/transactionLog.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { groupId, type, content } = req.body;
    const senderId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Groupe introuvable" });

    const newMessage = await Message.create({
      group: groupId,
      sender: senderId,
      type,
      content,
    });

    res.status(201).json({
      message: "💬 Message envoyé avec succès",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l’envoi du message", error });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({ group: groupId })
      .populate("sender", "firstName lastName email")
      .sort({ sentAt: 1 });

    res.status(200).json({
      message: "📜 Historique des messages",
      total: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur de récupération des messages", error });
  }
};

export const logTransaction = async (req, res) => {
  try {
    const { userId, groupId, type, amount, description } = req.body;

    const log = await TransactionLog.create({
      user: userId,
      group: groupId,
      type,
      amount,
      description,
    });

    res.status(201).json({
      message: "💰 Opération enregistrée avec succès",
      log,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur de journalisation", error });
  }
};

export const getGroupTransactions = async (req, res) => {
  try {
    const { groupId } = req.params;

    const logs = await TransactionLog.find({ group: groupId })
      .populate("user", "firstName lastName email")
      .sort({ date: -1 });

    res.status(200).json({
      message: "📊 Historique des transactions du groupe",
      total: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur de récupération des transactions", error });
  }
};
