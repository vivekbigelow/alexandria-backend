const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGO_URI;

console.log("connecting to", url);

mongoose
  .connect(url)

  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    minLength: 5,
    required: true,
  },
  hasRead: Boolean,
});

bookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Book", bookSchema);
