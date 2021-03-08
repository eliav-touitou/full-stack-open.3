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

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: Number,
});

const Person = mongoose.model("persons", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  id: Math.floor(Math.random() * 1000),
});

if (!process.argv[3] && !process.argv[4]) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
      mongoose.connection.close();
      process.exit[1];
    });
  });
} else {
  person.save().then((result) => {
    console.log(`${result} was saved!`);
    mongoose.connection.close();
  });
}
