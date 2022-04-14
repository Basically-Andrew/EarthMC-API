const express = require("express"),
      router = express.Router(),
      emc = require("earthmc")

var timeout = 10000

router.get("/:xPos/:zPos/:xBlocks/:zBlocks", async (req, res) => 
{
    var xPos = Number(req.params.xPos), zPos = Number(req.params.zPos)
    if (!xPos || !zPos) return res.status(400).json([])

    var xBlocks = Number(req.params.xBlocks), zBlocks = Number(req.params.zBlocks)

    if (!xBlocks) xBlocks = 500
    if (!zBlocks) zBlocks = 500

    var nearbyNations = await emc.getNearbyNations(xPos, zPos, xBlocks, zBlocks).then(nations => { return nations }).catch(() => {})
    if (!nearbyNations) return res.status(200).json([])
    
    res.status(200).json(nearbyNations).setTimeout(timeout)
})

module.exports = router