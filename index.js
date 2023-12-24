const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.get("/", (req, res) => {
    res.send("ProTaskManager is runing...");
})

app.listen(port, () => {
    console.log(`ProTaskManager is runing on PORT ${port}`)
})