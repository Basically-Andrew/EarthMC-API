// @ts-nocheck
const scout = require("@scout_apm/scout-apm"),
      express = require("express"),
      app = express()

// The "main" function
async function start() {
      // Trigger the download and installation of the core-agent
      await scout.install({
            allowShutdown: true, // allow shutting down spawned scout-agent processes from this program
            monitor: true, // enable monitoring
            name: process.env.SCOUT_NAME,
            key: process.env.SCOUT_KEY
      })

      // Enable the app-wide scout middleware
      app.use(scout.expressMiddleware())

      run()

      // Start express
      app.start()
}

async function run() {
      const rateLimit = require('express-rate-limit'),
            mainRoute = require("./routes/webpage/main"),
            inviteRoute = require("./routes/webpage/invite"),
            mapRoute = require("./routes/webpage/map"),
            townsRoute = require("./routes/api/v1/towns"),
            nationsRoute = require("./routes/api/v1/nations"),
            residentsRoute = require("./routes/api/v1/residents"),
            serverInfoRoute = require("./routes/api/v1/serverInfo"),
            onlinePlayersRoute = require("./routes/api/v1/onlinePlayers"),
            townlessPlayersRoute = require("./routes/api/v1/townlessPlayers"),
            allPlayersRoute = require("./routes/api/v1/allPlayers"),
            nearbyPlayersRoute = require("./routes/api/v1/nearbyPlayers"),
            nearbyTownsRoute = require("./routes/api/v1/nearbyTowns"),
            nearbyNationsRoute = require("./routes/api/v1/nearbyNations"),
            onlineRedirect = require("./routes/api/v1/redirects/online"),
            playersRedirect = require("./routes/api/v1/redirects/players"),
            townlessRedirect = require("./routes/api/v1/redirects/townless"),
            alliancesRoute = require("./routes/api/v1/alliances"),
            newsRoute = require("./routes/api/v1/news")

      var window = 5 * 1000
      const limiter = rateLimit({
            windowMs: window, // Time (ms) until limit is reset
            max: 10, // Limit each IP to x requests per `window`
            message: 'You are currently rate-limited, try again in ' + window/1000 + ' seconds.',
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      })
            
      app.set('trust proxy', 1)
      app.use(limiter)

      const compression = require('compression')
      app.use(compression()) // Compress all routes

      var bodyParser = require("body-parser")
      app.use(bodyParser.json({ limit: '20mb' }))
      app.use(bodyParser.urlencoded({ limit: "20mb", extended: true, parameterLimit: 20000 }))

      // Serve webpage routes.
      app.use("/", mainRoute)
      app.use("/invite", inviteRoute)
      //app.use("/map", mapRoute)

      // Serve API routes.
      app.use("/api/v1/towns", townsRoute)
      app.use("/api/v1/nations", nationsRoute)
      app.use("/api/v1/residents", residentsRoute)
      app.use("/api/v1/serverinfo", serverInfoRoute)
      app.use("/api/v1/onlineplayers", onlinePlayersRoute)
      app.use("/api/v1/townlessplayers", townlessPlayersRoute)
      app.use("/api/v1/allplayers", allPlayersRoute)
      app.use("/api/v1/nearby", nearbyPlayersRoute)
      app.use("/api/v1/nearbyplayers", nearbyPlayersRoute)
      app.use("/api/v1/nearbytowns", nearbyTownsRoute)
      app.use("/api/v1/nearbynations", nearbyNationsRoute)

      // Redirects
      app.use("/api/v1/online", onlineRedirect)
      app.use("/api/v1/players", playersRedirect)
      app.use("/api/v1/townless", townlessRedirect)

      // POST, PUT, DELETE restricted to EMC Stats.
      app.use("/api/v1/alliances", alliancesRoute)
      app.use("/api/v1/news", newsRoute)
      app.use("/api/v1/allplayers", allPlayersRoute)

      // Default not found response
      app.use((req, res) => 
      {
            var date = new Date()

            res.json({
                  "timestamp": date.getTime(),
                  "status": 404,
                  "error": "Endpoint Error",
                  "message": "Not found!",
                  "path": req.path
            })
      })

      // Error handling
      app.use((error, req, res) => 
      {
            var date = new Date()

            res.json({
                  "timestamp": date.getTime(),
                  "status": error.status || 500,
                  "error": "Internal Server Error",
                  "message": error.message,
                  "path": req.path
            })
      })
}

// If this script is executed directly, run the start function
if (require.main === module) start()
//else console.log("Starting from elsewhere!")

module.exports = app