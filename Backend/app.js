require("dotenv").config();
const express = require("express");
const { syncDatabase } = require("./models/index");
const cafeRoutes = require("./routes/cafeRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();
const frontend = process.env.FRONTENDURL || 8080;

app.use(express.json());
app.use(
    cors({
        origin: frontend, 
    })
);

app.use("/", cafeRoutes);
app.use("/", employeeRoutes);

app.get("/", (req, res) => {
    res.send("Cafe Management API is running...");
});

syncDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error syncing database:", err);
    });
