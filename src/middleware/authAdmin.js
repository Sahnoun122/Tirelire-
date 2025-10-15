

export const verifyAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        message: "Accès refusé : réservé à l'administrateur",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur middleware admin", error });
  }
};
