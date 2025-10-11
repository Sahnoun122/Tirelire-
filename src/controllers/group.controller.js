import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";


export const createGroup = async (req, res) => {
  try {
    const { name, description, contributionAmount, frequency, maxRounds, isOpen } = req.body;
    if (!name || !contributionAmount) return res.status(400).json({ message: "name and contributionAmount required" });

    const group = await Group.create({
      name,
      description,
      creator: req.user.id,
      members: [{ user: req.user.id, status: "active", joinedAt: new Date() }],
      contributionAmount,
      frequency: frequency || "monthly",
      maxRounds: maxRounds || 0,
      isOpen: isOpen !== undefined ? !!isOpen : true,
      currentRound: 0
    });

    return res.status(201).json({ message: "Group created", group });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getGroup = async(req , res )=>{


    try {
        const {id }= req.params;
    const group = await Group.findById(id)
      .populate("creator", "firstName lastName email")
      .populate("members.user", "firstName lastName email reliability_score");

      if(!group)
        return res.status(404).json({message : "groups not fond "});
    return res.json({ group});

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message : error.message })
    }
}


export const listGroups = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };

    const groups = await Group.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .select("name description contributionAmount members.length isOpen");

    const total = await Group.countDocuments(filter);
    return res.json({ data: groups, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


export const joinGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (!group.isOpen) return res.status(403).json({ message: "Group closed" });

    const already = group.members.find(m => m.user.toString() === userId);
    if (already) return res.status(400).json({ message: "Already a member" });

  group.members.push({ user: new mongoose.Types.ObjectId(userId), status: "active", joinedAt: new Date() });
    await group.save();
    return res.json({ message: "Joined group", group });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
