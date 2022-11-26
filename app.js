const express = require("express");

const app = express();

app.get("/search", (req, res) => {
  if (!req.query || !req.query.term.trim()) {
    res.send("return all");
  } else {
    res.send("filtered result");
  }
});

app.listen(3000);
