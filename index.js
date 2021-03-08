const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Dany Fish",
    number: "0545798445",
  },
  {
    id: 2,
    name: "Dan Fishman",
    number: "0545798333",
  },
  {
    id: 3,
    name: "Daniel Fishy",
    number: "0506798445",
  },
  {
    id: 4,
    name: "Dony Fishburg",
    number: "0545798645",
  },
];
app.use("/", express.static(`./build`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./index.html");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date().toString();
  res.send(
    `<div>Phone-book has info for ${persons.length} people.</div><div> ${date} </div>`
  );
});
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  res.json(person);
});
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});
app.post("/api/persons", (req, res) => {
  const newContact = req.body;

  if (!newContact.name || !newContact.number) {
    return res.status(404).send({ error: `must insert name + number` });
  }
  let existingName = persons.find((person) => person.name === newContact.name);
  if (existingName) {
    return res
      .status(400)
      .send({ error: `This name is already taken in the phoneBook` });
  }
  const id = Math.floor(Math.random() * 1000);

  newContact.id = id;
  persons.push(newContact);
  res.send(newContact);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
