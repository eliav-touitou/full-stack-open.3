const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://eli_t:${password}@cluster0.izmc9.mongodb.net/fullstackopen?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const person = new mongoose.Schema({
  neme: String,
  date: Date,
  id: number,
});

const Note = mongoose.model("persons", person);

const note = new Note({
  content: "HTML is Easy",
  date: new Date(),
  important: true,
});

note.save().then((result) => {
  console.log("new contact saved!");
  mongoose.connection.close();
});
