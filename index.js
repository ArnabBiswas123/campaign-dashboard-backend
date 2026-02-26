const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const campaignRouter = require('./routes/campaignRouter')
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("HKHKKKHHHRHRRRHH");
});

app.use("/api/v1/campaign", campaignRouter);
app.listen(port, () => {
    console.log(`Examples app listening on port ${port}`);
});