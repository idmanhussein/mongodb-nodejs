const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WatchSchema = new Schema({
  _id: String,
  title: { type: String, unique: true },
  filmId: String,
});

const Watch = mongoose.model("watch", WatchSchema); // movie.film

module.exports = Watch;
