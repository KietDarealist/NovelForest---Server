require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const cors = require("cors");

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lscsy.mongodb.net/novelforest?retryWrites=true&w=majority`, (err)=> {
            if (err) throw err;
            console.log('MongoDB Connected');
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(eror.message);
        process.exit(1);
    }
}

connectDB()


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> console.log(`Server is running in PORT ${PORT}`));