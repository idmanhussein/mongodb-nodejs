const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FilmSchema = new Schema({
  _id: String,
  title: { type: String, index: true },
  year: Number,
  rated: String,
  runtime: Number,
  countries: Array,
  genres: Array,
  director: String,
  actors: { type: Array, index: true },
  plot: String,
  imdb: {
    rating: Number,
    votes: Number,
  },
});

FilmSchema.index({ title: "text" }, { actors: "text" });
const Film = mongoose.model("film", FilmSchema); // movie.film

module.exports = Film;
