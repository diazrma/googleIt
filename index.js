const express = require("express");
const app = express();
const path = require("path");
const mime = require("mime");
const fs = require("fs");
const port = 3000;
const generateGif = require("./generateGif");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static("public"));
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/result", function (req, res) {
  res.sendFile(__dirname + "/views/result.html");
});

app.post("/q", function (req, res) {
  generateGif(`${req.body.search} `);
  setTimeout(() => {
    res.redirect("./result");
  }, 8000);
});

app.listen(port, () => {
  console.log(`Application run ${port}`);
});
