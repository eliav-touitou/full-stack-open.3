require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);
app.use(cors());

app.use("/", express.static(`./build`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./index.html");
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((e) => {
      res.status(500).json({ error: "server error" });
    });
});

app.get("/info", (req, res) => {
  const date = new Date().toString();

  Person.find({})
    .then((result) => {
      res.send(
        `<div>Phone-book has info for ${result.length} people.</div><div> ${date} </div>`
      );
    })
    .catch((e) => {
      res.status(500).json({ error: "server error" });
    });
});
app.get("/api/persons/:id", validId, (req, res) => {
  const id = Number(req.params.id);
  // const person = Person.find((person) => person.id === id);
  // res.json(person);
  Person.find({ id })
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((e) => {
      res.status(500).json({ error: "server error" });
    });
});
app.delete("/api/persons/:id", validId, (request, response) => {
  const id = Number(request.params.id);

  Person.remove({ id })
    .then((res) => {
      response.status(204).end();
    })
    .catch((e) => {
      res.status(500).json({ error: "server error" });
    });
});

app.post("/api/persons", (req, res) => {
  const newContact = req.body;
  console.log(req);
  if (!newContact.name || !newContact.number) {
    return res.status(404).send({ error: `must insert name + number` });
  }
  Person.find({ name: newContact.name }).then((result) => {
    if (result) {
      return res
        .status(400)
        .send({ error: `This name is already taken in the phoneBook` });
    }
  });

  const person = new Person({
    id: Math.floor(Math.random() * 1000),
    name: newContact.name,
    number: newContact.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((e) => {
      res.status(500).json({ error: "server error" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
function validId(req, res, next) {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  next();
}
