const express = require("express")


const app = express()

app.get("/", (req, res) => {
    console.log(req)
    res.status(200).send("fuck")
})


app.listen(3000, () => {
    console.log("server is running at port:3000")
})