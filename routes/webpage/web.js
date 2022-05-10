const express = require("express"),
      router = express.Router()

var webFolder = `${process.cwd()}/web/`

router.get('/', (req, res) => 
    res.sendFile(webFolder + 'index.html')
)

router.get('/invite', (req, res) => 
    res.sendFile(webFolder + 'invite.html')
)

router.get('/commands', (req, res) => 
    res.sendFile(webFolder + 'commands.html')
)

router.get('/elements', (req, res) => 
    res.sendFile(webFolder + 'elements.html')
)

module.exports = router