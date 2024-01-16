const express = require('express');
const app = express();

app.use(express.json());

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }

app.use(requestLogger);

let books = [
    {id: 1, title: 'The Fall', author: "Albert Camus"},
    {id: 2, title: "Anna Karenina", author: "Leo Tolstoy" },
    {id: 3, title: "Cat's Cradle", author: "Kurt Vonnegut"}
]

const generateId = () => {
    const maxId = books.length > 0 ? Math.max(...books.map(b => b.id)) : 0;
    return maxId + 1;
}
  
app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>');
})

app.get('/api/books', (request, response) => {
    response.json(books);
})

app.get('/api/books/:id', (request, response) => {
    const id = Number(request.params.id);
    const book = books.find(book => book.id === id);
    if (book){
        response.json(book);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/books/:id', (request, response) => {
    const id = Number(request.params.id);
    books = books.filter(book => book.id !== id);
    response.status(204).end();
    
})

app.post('/api/books', (request, response) => {
    const body = request.body
    if (!body.title || !body.author){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const book = {
        id: generateId(),
        title: body.title,
        author: body.author
    }

    books = books.concat(book);
    response.json(book);
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)