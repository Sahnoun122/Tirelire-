export function requireKYC(req , res , next){
    if(!req.user){
        return res.status(401).json({message :"Unauthorized" });
    }
    if(req.user.kyc_status !== verified){
        return res.status(403).json({message :"KYC verification required"})
    }
    next();
}