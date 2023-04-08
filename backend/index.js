const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const treeRoute = require("./routes/tree");

dotenv.config();


app.use(express.json());

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.log(err));

app.use("/api/users/", userRoute);
app.use("/api/trees", treeRoute);

app.listen(8800, () => {
    console.log("Backend server is running!");
});


app.post("/api/trees")