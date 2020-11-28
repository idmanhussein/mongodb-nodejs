const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WatchSchema = new Schema({
  _id: String,
  title: String,
  year: Number,
  rated: String,
  runtime: Number,
  countries: Array,
  genres: Array,
  director: String,
  actors: Array,
  plot: String,
  imdb: {
    rating: Number,
    votes: Number,
  },
});

const Watch = mongoose.model("watch", WatchSchema); // movie.film

module.exports = Watch;
