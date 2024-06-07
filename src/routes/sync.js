let express = require("express");
let router = express.Router();
const { syncDatabase } = require("../controllers/syncController");

router.get("/", async (req, res) => {
  try {
    await syncDatabase();
    return res.status(200).send("synced successfully");
  } catch (error) {
    console.log("Failed to sync Table" + error);
    return res.status(500).send("Failed to sync  Table" + error);
  }
});

module.exports = router;
