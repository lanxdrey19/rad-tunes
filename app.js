const express = require("express");
const currentItems = require("./data.json");

const app = express();

app.get("/search", (req, res) => {
  try {
    if (req.query.term.trim() === "") {
      res.status(200).json(currentItems);
    } else {
      console.log(req.query.term);

      const filteredItems = currentItems.filter(
        (item) =>
          item.genre.toLowerCase().trim() ===
          req.query.term.toLowerCase().trim()
      );

      res.status(200).json(filteredItems);
    }
  } catch (err) {
    res
      .status(400)
      .json({
        message:
          "you must enter a valid query term. e.g. search?term=<your search term here>",
      })
      .end();
  }
});

app.listen(3000);
