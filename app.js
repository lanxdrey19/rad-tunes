const express = require("express");
const items = require("./data.json");

const app = express();

app.get("/search", (req, res) => {
  if (!req.query || !req.query.term.trim()) {
    res.send(items);
  } else {
    const filteredData = items.filter(
      (item) =>
        item.genre.toLowerCase().trim() === req.query.term.toLowerCase().trim()
    );
    res.send(filteredData);
  }
});

app.listen(3000);
