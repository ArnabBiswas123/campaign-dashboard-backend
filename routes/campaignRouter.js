const express = require("express");
const getCampaigns = require("../controllers/getCampaign");
const router = express.Router();

router.get('/getcampaigns',getCampaigns)
module.exports = router;