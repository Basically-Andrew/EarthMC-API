const express = require("express"),
      router = express.Router()

router.get('/', function(req, res) 
{
    res.sendFile(`${process.cwd()}/web/monitor.html`)
})

module.exports = router