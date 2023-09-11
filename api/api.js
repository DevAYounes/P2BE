const express = require("express");
const router = express.Router();
const { register, login } = require("../Controllers/SqlUserController");
const { addPolls, getPolls,getMyPolls,getActivePolls,submit } = require("../Controllers/SqlPollsController");
router.post("/users/register", register);
router.post("/users/login", login);
//polls
router.post("/addPolls/:email",addPolls)
router.get("/getPolls/",getPolls)
router.get("/getMyPolls/:email",getMyPolls)
router.post("/getActivePolls/:email",getActivePolls)
router.post("/submit/:option",submit)
module.exports = router;
