require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :body")
);
app.use(cors());

app.use("/", express.static("./build"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./index.html");
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch(() => {
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
    .catch(() => {
      res.status(500).json({ error: "server error" });
    });
});
app.get("/api/persons/:id", validId, (request, response) => {
  const id = Number(request.params.id);
  Person.find({ id })
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send("Not found");
      }
    })
    .catch((e) => response.status(500).json({ ERROR: "Server Error" }));
});
app.delete("/api/persons/:id", validId, (request, response) => {
  const id = Number(request.params.id);

  Person.deleteOne({ id })
    .then(() => {
      response.status(204).end();
    })
    .catch(() => {
      response.status(500).json({ error: "server error" });
    });
});
app.put("/api/persons/:id", validId, (request, response) => {
  const { body } = request;
  const { id } = request.params;

  const person = {
    id: id,
    number: body.number,
  };
  Person.updateOne({ id }, person, { new: true }).then((updatedPerson) => {
    response.json(updatedPerson);
  });
});

app.post("/api/persons", uniqueName, async (req, response) => {
  const newContact = req.body;

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
    .catch((err) => {
      if (err.name === "ValidationError") {
        return response.status(400).json({ error: err.message });
      }
      return response
        .status(500)
        .send({ error: "Problems with our server", message: error.message });
    });
});

function validId(req, res, next) {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  next();
}
async function uniqueName(req, res, next) {
  const { body } = req;

  try {
    const uniqueName = await Person.find({ name: body.name });
    if (uniqueName.length !== 0) {
      return res.status(400).json({ error: "name must be unique" });
    }
    next();
  } catch {
    return res
      .status(500)
      .send({ error: "Problems with our server", message: error.message });
  }
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
