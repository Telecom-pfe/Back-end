const express = require("express")
const cors = require("cors")
const { createServer } = require("http");
const app = express();
const server = createServer(app);
const clientRouter = require("./routes/client")


app.use(cors());
app.use(express.json());
app.use("/api/client",clientRouter);

server.listen(3001,()=>{
    console.log("server started")
})  