/**
 * 200 is returned for successful queries as no new information is created as there is only a GET endpoint
 * 400 is returned for invalid queries has these are made by the client and are syntax errors
 * any other invalid query will return 500 to hide implementation details of the server which can be potentially
 * sensitive
 */

const express = require("express");
const currentItems = require("./data.json"); // all the artists

const app = express();

app.get("/search", (req, res) => {
  // try-catch added to hide potentially sensitive server implementation
  try {
    let finalResults;
    const noResults = [];

    if (
      !(
        "exclude" in req.query ||
        "include" in req.query ||
        "has" in req.query ||
        "hasnot" in req.query
      )
    ) {
      res
        .status(400)
        .json({
          error_message:
            "you must have at least one of the query terms: exclude, include, has, hasnot",
        })
        .end();
    }
    /**
     * Edge case where only one query term is entered and it is left blank.
     * The assumption is that the user wanted to include or exclude everything.
     */
    if (Object.keys(req.query).length === 1) {
      if ("include" in req.query && !Array.isArray(req.query.include)) {
        if (req.query.include.trim() === "") {
          res.status(200).json(currentItems).end();
        }
      } else if ("has" in req.query && !Array.isArray(req.query.has)) {
        if (req.query.has.trim() === "") {
          res.status(200).json(currentItems).end();
        }
      } else if ("exclude" in req.query && !Array.isArray(req.query.exclude)) {
        if (req.query.exclude.trim() === "") {
          res.status(200).json(noResults).end();
        }
      } else if ("hasnot" in req.query && !Array.isArray(req.query.hasnot)) {
        if (req.query.hasnot.trim() === "") {
          res.status(200).json(noResults).end();
        }
      }
    }

    /**
     * Ensure that the endpoint call contains only inclusion-related or exclusion-related query terms
     */
    if (
      Object.keys(req.query).length > 1 &&
      (("include" in req.query &&
        ("exclude" in req.query || "hasnot" in req.query)) ||
        ("has" in req.query &&
          ("exclude" in req.query || "hasnot" in req.query)) ||
        ("exclude" in req.query &&
          ("include" in req.query || "has" in req.query)) ||
        ("hasnot" in req.query &&
          ("include" in req.query || "has" in req.query)))
    ) {
      res
        .status(400)
        .json({
          err_msg:
            "you can not have both inclusion-related and exclusion-related keys in your query parameters However, you can have multiple instances of only one of them i.e. mulitiple instances of include and has or multiple instances of exclude and hasnot",
        })
        .end();
    }

    let searchTermsIncludeArray = [];
    let searchTermsHasArray = [];
    let searchTermsExcludeArray = [];
    let searchTermsHasNotArray = [];

    /**
     * if there is only one value for the query key, it is not an array,
     * hence, it needs to be an array so it can be processed the same way if
     * there is more than one value for the key
     */

    if ("include" in req.query || "has" in req.query) {
      let searchTermsIncludeArrayLowerCase = [];
      let searchTermsHasArrayLowerCase = [];
      if ("include" in req.query) {
        if (!Array.isArray(req.query.include)) {
          searchTermsIncludeArray.push(req.query.include);
        } else {
          searchTermsIncludeArray = req.query.include;
        }
        searchTermsIncludeArrayLowerCase = searchTermsIncludeArray.map((item) =>
          item.toLowerCase().trim()
        );
      }
      if ("has" in req.query) {
        if (!Array.isArray(req.query.has)) {
          searchTermsHasArray.push(req.query.has);
        } else {
          searchTermsHasArray = req.query.has;
        }
        searchTermsHasArrayLowerCase = searchTermsHasArray.map((item) =>
          item.toLowerCase().trim()
        );
      }

      finalResults = currentItems.filter((item) => {
        if (
          searchTermsIncludeArrayLowerCase.includes(
            item.genre.toLowerCase().trim()
          ) ||
          searchTermsHasArrayLowerCase.find((hasTerm) => {
            if (
              item.genre
                .toLowerCase()
                .trim()
                .includes(hasTerm.toLowerCase().trim())
            ) {
              return true;
            }
          })
        ) {
          return item;
        }
      });

      res.status(200).json(finalResults).end();
    } else if ("exclude" in req.query || "hasnot" in req.query) {
      let searchTermsExcludeArrayLowerCase = [];
      let searchTermsHasNotArrayLowerCase = [];
      if ("exclude" in req.query) {
        if (!Array.isArray(req.query.exclude)) {
          searchTermsExcludeArray.push(req.query.exclude);
        } else {
          searchTermsExcludeArray = req.query.exclude;
        }
        searchTermsExcludeArrayLowerCase = searchTermsExcludeArray.map((item) =>
          item.toLowerCase().trim()
        );
      }

      if ("hasnot" in req.query) {
        if (!Array.isArray(req.query.hasnot)) {
          searchTermsHasNotArray.push(req.query.hasnot);
        } else {
          searchTermsHasNotArray = req.query.hasnot;
        }
        searchTermsHasNotArrayLowerCase = searchTermsHasNotArray.map((item) =>
          item.toLowerCase().trim()
        );
      }

      finalResults = currentItems.filter((item) => {
        if (
          !(
            searchTermsExcludeArrayLowerCase.includes(
              item.genre.toLowerCase().trim()
            ) ||
            searchTermsHasNotArrayLowerCase.find((hasTerm) => {
              if (
                item.genre
                  .toLowerCase()
                  .trim()
                  .includes(hasTerm.toLowerCase().trim())
              ) {
                return true;
              }
            })
          )
        ) {
          return item;
        }
      });

      res.status(200).json(finalResults).end();
    }
  } catch (err) {
    // uncomment this line for debugging purposes
    // res.status(500).json({ err_msg: err.message });
    res.status(500).json({ error_msg: "a server error occurred" });
  }
});

app.listen(3000);
