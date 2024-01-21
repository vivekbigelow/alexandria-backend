const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://admin:${password}@cluster0.zaaw8zi.mongodb.net/alexandria?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
})

const Book = mongoose.model('Book', bookSchema)

const book = new Book({
  title: 'The Fall',
  author: 'Albert Camus',
})

book.save().then(result => {
  console.log('book saved!')
  mongoose.connection.close()
})