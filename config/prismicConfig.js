const { createClient } = require("@prismicio/client")
const repoName = ""
const accessToken = "" 
const routes = []

const client = createClient(repoName, {
  fetch,
  accessToken,
})

module.exports = client
