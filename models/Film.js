const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FilmSchema = new Schema({
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

const Film = mongoose.model("film", FilmSchema);

module.exports = Film;
