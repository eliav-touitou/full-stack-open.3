require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;
console.log("connecting to", url);
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => console.log("error connecting to mongodb: ", err.message));

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
