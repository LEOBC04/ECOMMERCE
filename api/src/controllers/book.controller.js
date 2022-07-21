const Book = require("../models/Book.js");
const User = require("../models/User.js");

const getBooks = async (req, res) => {
  try {
    const options = req.query;
    const books = await Book.paginate({}, options);
    return res.status(200).json({ books: books });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id).populate(
      "sellers",
      "-_id -__v -selling_books -wish_list"
    );
    return res.status(200).json({ book: book });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const postBook = async (req, res) => {
  const book = req.body;
  console.log(book);
  try {
    const bookAdded = await Book.create(book);
    // return res.status(201).json({ bookCreated: bookCreated });
    return res.status(201).json({ bookAdded: "book added" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const putBook = async (req, res) => {
  const { idBook } = req.params;
  const { idUser } = req.params;
  const book = req.body;
  if (!idUser) {
    try {
      const bookUpdated = await Book.updateOne({ _id: idBook }, { $set: book });
      return res.status(201).json({ bookUpdated: bookUpdated });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    try {
      const bookUpdated = await Book.findByIdAndUpdate(
        idBook,
        { $push: { sellers: idUser } },
        { new: true, useFindAndModify: false }
      );
      return res.status(201).json({ bookUpdated: bookUpdated });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const bookDeleted = await Book.deleteOne({ _id: id });
    return res.status(201).json({ bookDeleted: bookDeleted });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  getBooks,
  postBook,
  getBookById,
  putBook,
  deleteBook,
};
