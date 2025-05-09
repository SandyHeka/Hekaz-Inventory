import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) =>{
    res.send("Hekaz Inventory API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`) );