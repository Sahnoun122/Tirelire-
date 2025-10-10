import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createGroup = async (req , res )=>{
    try {
        const {name, description, contributionAmount, frequency, maxRounds, isOpen} = req.body;
        if(!name || !contributionAmount){
            return res.status(400).json({message : "name and contributionAmount required"})
        }

        const group = await Group.create({
            name, 
            description,
            contributionAmount,
            creator : req.user.id,
            memebers : [{ user : req.user.id , status : "active" , joinedAt : new Date()}],
            contributionAmount,
            frequency : frequency || "monthly",
            maxRounds : maxRounds || 0,
            isOpen: isOpen !== undefined ? !!isOpen : true,
           currentRound: 0,
        });

        return res.status(201).json({message : "Group created" , group });
        
    } catch (error) {
        
        console.log(error )

        return res.status(500).jsno({message : error.message})
    }
};