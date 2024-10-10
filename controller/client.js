const prisma = require("../db/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const signUp = async (req,res)=>{

let {
email,
password,
fullName,
phoneNumber,
dateDeNaissance,
createdAt
}=req.body
createdAt = new Date(createdAt);
createdAt = createdAt.toISOString();

 

 const checkemail = await prisma.Client.findUnique({
    where: { email: email }
  });

  if (checkemail) {
    return res.status(400).json("account exist ");
  }

  const hashedPassword = bcrypt.hashSync(password, 8);


  const newClient = {
    email,
    password:hashedPassword,
    fullName,
    phoneNumber,
    dateDeNaissance,
    createdAt,
    role:"client",
    updatedAt:null
  }
  let result = await prisma.client.create({ data: newClient });

  res.status(200).json(result);
}

module.exports={
    signUp,
    signIn
}


const signIn = async (req,res)=>{
    const { email, password, patientId } = req.body;

    if (!email || !password) {
      return res.status(404).json("Email or Password should be provided");
    } 
  
    try {
      const client = await prisma.client.findUnique({
        where: {
          email: email,
        },
      });
      if (!client) {
        return res.status(404).json("doctor not found");
      }
      const cofirmPassword = await bcrypt.compare(password, doctor.password);
  
      if (!cofirmPassword) {
        return res.status(401).json("Password is incorrect.");
      }
    
      if (client && cofirmPassword ) {
        const subtoken = jwt.sign(
          {
            doctorId: doctor.id,
            role: doctor.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        return res.status(405).json({mes:"You have to subscribe.",subtoken});
      }
      
      const token = jwt.sign(
        {
          clientId: client.id,
          role: client.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
  
      let loggedUser = {
        id: client.id,
        FullName: client.fullName,
      };
  
      res.status(200).json({ loggedUser, token, message: "Login succeeded" });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
}

