const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const signIn = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const client = await prisma.client.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
      },
    });

    if (!client) {
      return res.status(401).json({
        success: false,
        message: "Client not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, client.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: client.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      client: {
        id: client.id,
        email: client.email,
        phoneNumber: client.phoneNumber,
        fullName: client.fullName,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const createArticle = async (req, res) => {
    res.status(201).json({ success: true, message: "article created successfully" });
}
module.exports = {
    createArticle,
  signIn,
};
