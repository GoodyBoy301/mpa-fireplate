const express = require("express")
const compression = require("compression")
const path = require("path")
const preloadables = require("./preloadables")
const app = express()
const port = process.env.port || 3000
const client = require("./config/prismicConfig.js")
const prismic = require("@prismicio/client")
const UAParser = require("ua-parser-js")

const cors = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  next()
}

const UA = function (req, res, next) {
  const ua = UAParser(req.headers["user-agent"])
  res.locals.isPhone = ua.device.type === "mobile"
  res.locals.isTablet = ua.device.type === "tablet"
  res.locals.isDesktop = ua.device.type === undefined
  next()
}


app.use(express.static(path.join(__dirname, "public")))
app.use(compression())
app.use(cors)
app.use(UA)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

let setPreloadables

const getPreloadables = async (copy) => {
  if (setPreloadables) return setPreloadables

  setPreloadables = {}
  setPreloadables.images = []
  setPreloadables.videos = []
  return setPreloadables
}

let Data

const getData = async () => {
  const data = await client.get()
  // Data = data.results.find((y) => y.type === "tester_home").data
  getPreloadables(Data)
}

app.get("/", async (req, res) => {
  const preloadables = await getPreloadables()
  if (!Data) await getData()
  res.render("pages/home", {
    preloadables,
    prismic,
    copy: Data,
  })
  getData()
})

app.get("*", (req, res) => {
  res.redirect("/")
})

app.listen(port, () => {
  console.log(
    `\x1b[32m Server listening at\x1b[0m`,
    `\x1b[4mhttp://localhost:${port}\x1b[0m`
  )
  getData()
})

module.exports = app
