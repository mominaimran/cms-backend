import jwt from "jsonwebtoken";

const generateToken = (res, userId, role) => {
  const token = jwt.sign(
    { userId, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );

  // secure cookie set karo
  res.cookie("jwt", token, {
    httpOnly: true,      // JS se access nahi hoga
    secure: process.env.NODE_ENV === "production", // sirf HTTPS pe prod me
    sameSite: "strict", 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
  });

  return token;
};

export default generateToken;
