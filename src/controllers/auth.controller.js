import bcrypt from "bcryptjs";
import User from './model/user.model.js';
import {generateTokon} from '../config/jwt.js';
import { token } from "morgan";

export const register = async (req , res )=>{
 try {
    const {firstNmae , lastName ,email ,password}= req.body;
     
    const existingUser  = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message : "email deja existe "});
    }

    const hashedPassword = await bcrypt.hash(password,10);


    const user = await User.create({
        firstNmae,
        lastName,
        email,
        password : hashedPassword
    });

    const token = generateTokon(user);
    res.status(201).json({message : "la creation de token" , token});
} catch (error) {
    res.status(500).json({message : "erreur sur token " , token})
 }
};