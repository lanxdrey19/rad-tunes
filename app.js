const express = require("express");
const currentItems = require("./data.json");

const app = express();

app.get("/search", (req, res) => {
  try {
    if (req.query.term.trim() === "") {
      res.send(currentItems);
    } else {
      console.log(req.query.term);

      const filteredItems = currentItems.filter(
        (item) =>
          item.genre.toLowerCase().trim() ===
          req.query.term.toLowerCase().trim()
      );

      res.send(filteredItems);
    }
  } catch (err) {
    res.status(400).json({ message: err.message }).end();
  }
});

app.listen(3000);
