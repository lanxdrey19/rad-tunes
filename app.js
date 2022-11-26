const express = require("express");
const currentItems = require("./data.json");

const app = express();

app.get("/search", (req, res) => {
  try {
    console.log(req.query);
    if (!Array.isArray(req.query.term) && req.query.term.trim() === "") {
      res.status(200).json(currentItems);
    } else {
      let searchTermsArray = [];

      if (!Array.isArray(req.query.term)) {
        searchTermsArray.push(req.query.term);
      } else {
        searchTermsArray = req.query.term;
      }
      console.log(searchTermsArray);
      const filteredItems = currentItems.filter((item) => {
        let count = 0;
        searchTermsArray.forEach((genre) => {
          if (genre.toLowerCase().trim() === item.genre.toLowerCase().trim()) {
            count++;
          }
        });
        if (count > 0) {
          return item;
        }
      });

      res.status(200).json(filteredItems);
    }
  } catch (err) {
    res
      .status(400)
      .json({
        error_message:
          "you must enter a valid query term in this format e.g. http://localhost:3000/search?term=<your_search_term_here> or http://localhost:3000/search?term=<your_first_search_term_here>&term=<your_second_search_term_here>",
      })
      .end();
  }
});

app.listen(3000);
