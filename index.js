require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Book = require("./models/books");

app.use(express.static("dist"));
app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.use(cors());

// const book = new Book({
//   title: 'The Fall',
//   author: 'Albert Camus',
//   hasRead: false
// })

// book.save().then(result => {
//   console.log('book saved!')
//   mongoose.connection.close()
// })

// let books = [
//     {id: 1, title: 'The Fall', author: "Albert Camus"},
//     {id: 2, title: "Anna Karenina", author: "Leo Tolstoy" },
//     {id: 3, title: "Cat's Cradle", author: "Kurt Vonnegut"}
// ]

app.get("/", (request, response) => {
  response.send("<h1>Alexandria Backend</h1>");
});

app.get("/api/books", (request, response) => {
  Book.find({}).then((books) => {
    response.json(books);
  });
});

app.get("/api/books/:id", (request, response, next) => {
  Book.findById(request.params.id)
    .then((book) => {
      if (book) {
        response.json(book);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/books/:id", (request, response, next) => {
  Book.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/books/:id", (request, response, next) => {
  const { title, author, hasRead } = request.body;

  Book.findByIdAndUpdate(
    request.params.id,
    { title, author, hasRead },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedBook) => {
      response.json(updatedBook);
    })
    .catch((error) => next(error));
});

app.post("/api/books", (request, response, next) => {
  const body = request.body;

  const book = new Book({
    title: body.title,
    author: body.author,
    hasRead: body.hasRead || false,
  });

  book
    .save()
    .then((savedBook) => {
      response.json(savedBook);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
// This has to be the last loaded middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
