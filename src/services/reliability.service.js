import User from "../models/user.model.js";

export const updateReliabilityScore = async (userId, status) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("Utilisateur introuvable");

    if (status === "succeeded") {
      user.reliability_score += 5; 
    } else if (status === "failed") {
      user.reliability_score -= 10; 
    }

    if (user.reliability_score < 0) user.reliability_score = 0;
    if (user.reliability_score > 200) user.reliability_score = 200;

    await user.save();
    console.log(`🔁 Nouveau score fiabilité (${user.email}): ${user.reliability_score}`);

  } catch (error) {
    console.error("Erreur updateReliabilityScore:", error.message);
  }
};
