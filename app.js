const express = require("express");
const currentItems = require("./data.json");

const app = express();

app.get("/search", (req, res) => {
  try {
    let finalResults;
    const noResults = [];
    if (
      !Array.isArray(req.query["include"]) &&
      Object.keys(req.query).length === 1 &&
      "include" in req.query
    ) {
      if (req.query.include.trim() === "") {
        res.status(200).json(currentItems).end();
      }
    } else if (
      !Array.isArray(req.query["exclude"]) &&
      Object.keys(req.query).length === 1 &&
      "exclude" in req.query
    ) {
      if (req.query.exclude.trim() === "") {
        res.status(200).json(noResults).end();
      }
    }

    if (
      Object.keys(req.query).length > 1 &&
      "exclude" in req.query &&
      "include" in req.query
    ) {
      res
        .status(400)
        .json({
          err_msg:
            "you can not have both include and exclude keys in your query parameters. However, you can have multiple instances of only one of them",
        })
        .end();
    }

    if ("include" in req.query) {
      let searchTermsIncludeArray = [];
      if (!Array.isArray(req.query.include)) {
        searchTermsIncludeArray.push(req.query.include);
      } else {
        searchTermsIncludeArray = req.query.include;
      }
      const searchTermsIncludeArrayLowerCase = searchTermsIncludeArray.map(
        (item) => item.toLowerCase().trim()
      );

      finalResults = currentItems.filter((item) => {
        console.log(item.genre.toLowerCase().trim());
        if (
          searchTermsIncludeArrayLowerCase.includes(
            item.genre.toLowerCase().trim()
          )
        ) {
          return item;
        }
      });

      res.status(200).json(finalResults).end();
    } else if ("exclude" in req.query) {
      let searchTermsExcludeArray = [];
      if (!Array.isArray(req.query.exclude)) {
        searchTermsExcludeArray.push(req.query.exclude);
      } else {
        searchTermsExcludeArray = req.query.exclude;
      }
      const searchTermsExcludeArrayLowerCase = searchTermsExcludeArray.map(
        (item) => item.toLowerCase().trim()
      );
      finalResults = currentItems.filter((item) => {
        if (
          !searchTermsExcludeArrayLowerCase.includes(
            item.genre.toLowerCase().trim()
          )
        ) {
          return item;
        }
      });
      res.status(200).json(finalResults).end();
    }
  } catch (err) {
    //   res.status(400)
    //   .json({
    //     error_message:
    //       "you must enter a valid query term in this format e.g. http://localhost:3000/search?term=<your_search_term_here> or http://localhost:3000/search?term=<your_first_search_term_here>&term=<your_second_search_term_here>",
    //   })
    //   .end();

    res.status(400).json({ err_msg: err.message });
  }
});

app.listen(3000);
