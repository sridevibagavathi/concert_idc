import express from "express";
const app = express();
require("dotenv").config();
import compression from "compression";
import userRoutes from "./routes/userRoutes";
import bodyParser from "body-parser";
const PORT = process.env.PORT;
const urlencodedParser = bodyParser.urlencoded({ extended: false }); // to support URL-encoded bodies

app.use(compression()); //Compress all routes
app.use("/", urlencodedParser, userRoutes);
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
