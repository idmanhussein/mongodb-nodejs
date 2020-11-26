const express = require("express");
const db = require("./models/index");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const apiPort = 4000;
const Film = require("./models/Film")

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.once("open", async () => {
  if ((await getFilms.countDocuments().exec()) > 0) return;

  Promise.all([getFilms]).then(() => console.log("Here are your films!"));
});

// Pagination

app.get("/films", pagination(Film), async (req, res) => {
  const getFilms = await client.db("movie").collection("films").find({});
  res.json(getFilms);
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

app.post("/films", async (req, res) => {
  const createdFilm = await client
    .db("movie")
    .collection("films")
    .insertOne(req.body);

  res.json({
    message: "Created a new film!",
    data: createdFilm,
  });
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

app.patch("/films/:id", async (req, res) => {
  console.log(req.body);

  const updatedFilm = await client
    .db("movie")
    .collection("films")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

  const matchingFilm = await client
    .db("movie")
    .collection("films")
    .findOne({ _id: new ObjectId(req.params.id) });

  res.json({
    message: "Updated a film",
    data: matchingFilm,
  });
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
