const express = require("express");
const app = express();
const clientRouter = require("./routes/client");
const adminRouter = require("./routes/admin");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/client", clientRouter);
app.use("/api/admin", adminRouter);

app.listen(3000, () => {
  console.log("server started");
});
