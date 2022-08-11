const Book = require("../models/Book.js");
const User = require("../models/User.js");
const {
  paginate,
  sortNames,
  sortPrices,
  sortReleased,
  sortDiscount,
  getByStatus,
  getByLanguage,
  getByName,
  getByGenre,
  getByAuthor,
  getByOffers
} = require("../lib/book.controller.helper.js");

const getBooks = async (req, res) => {
  const { name } = req.query;
  //sort is a string (asc / desc)
  const { sort } = req.query;
  //released is a string (asc / desc)
  const { released } = req.query;
  //released is a string (asc / desc)
  const { price } = req.query;
  //discount is a string (asc/desc)
  const { discount } = req.query;
  //status is a string (true/false)
  const { status } = req.query;
  //language is a string (language(en, es, fr, ...))
  const { language } = req.query;
  //genre is a string (genre(fictino, horror, history, ...))
  const { genre } = req.query;
  //author is a string (author(Edgar allan poe, Horacio quiroga, ...))
  const { author } = req.query;

  const { limit, page } = req.query;

  try {
    let books = await Book.find({$and:[
      {stock:{$gte:1}},
      { deleted: false }]});
    if (sort) books = sortNames({ books, sort });
    if (price) books = sortPrices({ books, price });
    if (released) books = sortReleased({ books, released });
    if (discount) books = sortDiscount({ books, discount });
    if (status) books = getByStatus({ books, status });
    if (language) books = getByLanguage({ books, language });
    if (name) books = getByName({ books, name });
    if (genre) books = getByGenre({ books, genre });
    if (author) books = getByAuthor({ books, author });

    // return res.status(200).json(paginate({ limit, page, books }));
    console.log
    return res.status(200).json({ books });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id).populate(
      "seller",
      "-_id -__v -selling_books -wish_list -purchased_books"
    );
    return res.status(200).json({ book: book });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const getGenresBook = (req, res) => {
  const genres = [
    "autobiography",
    "fantasy",
    "fiction",
    "history",
    "horror",
    "science",
    "terror",
    "thriller",
  ];
  try {
    return res.status(200).json({ genres });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const postBook = async (req, res) => {
  const book = req.body;
  const { idUser } = req.params;
  if (!idUser) {
    try {
      await Book.create(book);
      // return res.status(201).json({ bookCreated: bookCreated });
      return res.status(201).json({ bookAdded: "book added" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    try {
      const bookAdded = await Book.create(book);
      //realtionships
      const bookRelation = await Book.findByIdAndUpdate(
        bookAdded._id,
        { $push: { sellers: idUser } },
        { new: true, useFindAndModify: false }
      );

      const userUpdated = await User.findByIdAndUpdate(
        idUser,
        { $push: { selling_books: bookAdded._id } },
        { new: true, useFindAndModify: false }
      );

      return res.status(201).json({ bookAdded: "book added and relationship" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
};

const putCommentBook = async (req, res) => {
  const { idBook, idUser } = req.params
  const { comment, score } = req.body

  try {
    await Book.findByIdAndUpdate(idBook, {
      $push: { reviews: { comment, score, id_user: idUser } }
    })
    res.status(202).json({ mesagge: 'Thanks for your review' })
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

const putBook = async (req, res) => {

  const { idBook } = req.params;
  const book = req.body
  console.log(idBook)
  console.log(book)
    try {
      const bookUpdated = await Book.updateOne({ _id: idBook }, { $set: book });
      res.status(201).json({ bookUpdated: bookUpdated });
    } catch (error) {
      res.status(500).json({ error: error });
    }
};

const deleteBook = async (req, res) => {
  const { idBook } = req.params;
  const { idUser } = req.params;
  if (!idUser) {
    try {
      const bookDeleted = await Book.findByIdAndUpdate(idBook, {
        deleted: true,
      });
      return res.status(201).json({ bookDeleted: bookDeleted });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  } else {
    try {
      const bookDeleteRelation = await Book.findByIdAndUpdate(idBook, {
        $pull: {
          sellers: idUser,
        },
      });

      const userDeleteRlation = await User.findByIdAndUpdate(idUser, {
        $pull: {
          selling_books: idBook,
        },
      });
      return res.status(201).json({ bookDeleted: "relationship deleted" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
};

const getBooksinOffers = async (req, res) => {
  try {
    let books = await Book.find({ deleted: false });
    prueba = await getByOffers({ books })
    console.log(prueba)
    return res.status(200).json({ prueba });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

module.exports = {
  getBooks,
  getGenresBook,
  postBook,
  getBookById,
  putCommentBook,
  putBook,
  deleteBook,
  getBooksinOffers
};
