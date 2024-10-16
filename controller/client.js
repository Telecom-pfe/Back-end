const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const createClient = async (req, res) => {
  try {
    const { phoneNumber, email, password, fullName, birthDate } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)
    const newClient = await prisma.client.create({
      data: {
        phoneNumber: phoneNumber || null,
        email: email || null,
        password:hashedPassword,
        fullName,
        birthDate: new Date(birthDate),
      },
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client: newClient,
    });
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(400).json({
        success: false,
        message: "Phone number or email already exists",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

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

module.exports = {
  createClient,
  signIn,
};
