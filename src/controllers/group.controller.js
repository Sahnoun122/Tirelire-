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


export const leaveGroup  = async (req , res )=>{
    try {

        const {id }= req.params;
        const userId = req.user.id;

        const group = await Group.findById(id)
        if(!group)
            return res.status(400).json({message : "group not found"});

        const idx = group.members.findIndex(m=> m.user.toString() === userId);
        if(idx === -1)
            return res.status(400).json({message : "not a member "})

        group.members.splice(idx , 1);
         await group.save();
        
         return res.status(200).json({message : "left group" , group})

    } catch (error) {
        console.error(error);
        return res.status(500).json({message : error.message})
    }
}
export const startRound = async (req, res) => {
  try {
    const { id } = req.params; // group id
    const userId = req.user.id;

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.creator.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only creator or admin can start round" });
    }

    const nextRoundNum = group.currentRound + 1;
    if (group.maxRounds && nextRoundNum > group.maxRounds) {
      return res.status(400).json({ message: "Max rounds reached" });
    }

    if (group.members.length === 0) return res.status(400).json({ message: "No members" });

    // compute beneficiary: order by reliability_score desc
    const membersWithScore = await Promise.all(
      group.members.map(async m => {
        const u = await User.findById(m.user).select("reliability_score");
        return { member: m, score: u?.reliability_score ?? 0, joinedAt: m.joinedAt };
      })
    );

    membersWithScore.sort((a,b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.joinedAt) - new Date(b.joinedAt);
    });

    const beneficiary = membersWithScore[(nextRoundNum - 1) % membersWithScore.length].member.user;

    const round = {
      roundNumber: nextRoundNum,
      beneficiary,
      status: "active",
      startDate: new Date(),
      totalCollected: 0
    };

    group.rounds.push(round);
    group.currentRound = nextRoundNum;
    await group.save();

    return res.json({ message: "Round started", round });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
