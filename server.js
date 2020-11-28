const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const db = require("./models/index");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const apiPort = 4000;
const Film = require("./models/Film");
const Watch = require("./models/Watch");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.once("open", async () => {
  if ((await Film.countDocuments().exec()) > 0) return;

  Promise.all([Film]).then(() => console.log("Here are your films!"));
});

// Pagination

app.get("/films", pagination(Film), async (req, res) => {
  res.json(res.paginatedResults);
});
function pagination(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

// Create a POST endpoint which creates a new collection called watch and inserts a film id and title into a collection
app.post("/watch", (req, res) => {
  //created new collection using db.createCollection() but couldn't do it more than once, so collection already exists
  try {
    const addFilm = new Watch({
      _id: "0eafaadje5fad",
      title: "The Wizard of Oz",
    });
    Watch.create(addFilm, function () {
      console.log(addFilm);
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/films/:id", async (req, res) => {
  const matchingFilm = await client
    .db("movie")
    .collection("films")
    .findOne({ _id: new ObjectId(req.params.id) });

  res.json({
    message: "Here is that film",
    data: matchingFilm,
  });
});

app.delete("/films/:id", async (req, res) => {
  await client
    .db("movie")
    .collection("films")
    .deleteOne({ _id: new ObjectId(req.params.id) });

  res.json({
    message: "Deleted a film",
  });
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
