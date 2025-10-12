import Contribution from "../models/contribution.model.js";
import Group from "../models/group.model.js";

export const createContribution = async (req, res) => {
  try {
    const { groupId, roundNumber, amount, startDate, endDate, members } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Le groupe n'existe pas" });
    }

    const newContribution = await Contribution.create({
      group: groupId,
      roundNumber,
      amount,
      startDate,
      endDate,
      members,
    });

    group.contributions.push(newContribution._id);
    await group.save();

    res.status(201).json({
      message: " Contribution créée avec succès",
      contribution: newContribution,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
};

export const getGroupContributions = async (req, res) => {
  try {
    const { groupId } = req.params;

    const contributions = await Contribution.find({ group: groupId }).populate("members.user");
    res.status(200).json(contributions);
  } catch (error) {
    res.status(500).json({ message: "Erreur de récupération", error });
  }
};

export const markAsPaid = async (req, res) => {
  try {
    const { contributionId, userId } = req.body;

    const contribution = await Contribution.findById(contributionId);
    if (!contribution) return res.status(404).json({ message: "Contribution introuvable" });

    const member = contribution.members.find((m) => m.user.toString() === userId);
    if (!member) return res.status(404).json({ message: "Membre introuvable dans cette contribution" });

    member.paid = true;
    member.paymentDate = new Date();

    if (contribution.members.every((m) => m.paid)) {
      contribution.isCompleted = true;
    }

    await contribution.save();

    res.status(200).json({ message: " Paiement marqué avec succès", contribution });
  } catch (error) {
    res.status(500).json({ message: "Erreur de mise à jour", error });
  }
};
