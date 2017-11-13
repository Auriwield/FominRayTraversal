"use strict";

const port = process.env.PORT || 8080;
const express = require('express');
const app = express();

app.use("/", express.static(__dirname + "/../dist/public"));
app.listen(port);

console.info("Server started at port " + port);