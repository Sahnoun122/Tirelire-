import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import { generateToken } from '../config/jwt.js';

export const register = async (req , res )=>{
 try {
    const {firstName , lastName ,email ,password}= req.body;
     
    const existingUser  = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message : "email deja existe "});
    }

    const hashedPassword = await bcrypt.hash(password,10);


    const user = await User.create({
        firstName,
        lastName,
        email,
        password : hashedPassword
    });
    

    const token = generateToken({id: user._id, firstName: user.firstName, email: user.email});
    res.status(201).json({message : "Utilisateur créé avec succès", token, user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    }});
} catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({message : "Erreur serveur lors de l'inscription", error: error.message});
 }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = generateToken({
            id: user._id,
            firstName: user.firstName,
            email: user.email,
            role: user.role
        });

        res.status(200).json({
            message: "Connexion réussie",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: "Erreur serveur lors de la connexion", error: error.message });
    }
};