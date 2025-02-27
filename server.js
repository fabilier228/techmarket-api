const express = require('express')
const dotenv = require("dotenv")
const app = express()
const port = dotenv.

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})