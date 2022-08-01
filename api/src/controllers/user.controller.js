const User = require("../models/User.js");
const Book = require("../models/Book.js");
const bcrypt = require("bcrypt");
const { getByName } = require("../lib/user.controller.helper.js");
const { sendMailActivateGoogle } = require("./sendMail.controller.js");


const getUsers = async (req, res) => {
  const { name } = req.query;
  try {
    let users = await User.find();
    if (name) users = getByName({ users, name });

    return res.status(200).json({ users: users });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const getUserByID = async (req, res) => {
  const { idUser } = req.params;
  try {
    const userrrsId = await User.findById(idUser).populate(
      "selling_books",
      "-_id -__v -sellers"
    );
    return res.status(200).json({ userrrs: userrrsId });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  // en POSTMAN GET:
  // http://localhost:3000/users/acavaelidObtenidodesdeMongoDB
};

const postUserGoogle = async (req, res) => {
  try {
    //const user = req.body;
    const {email,password}=req.body;
    const nuevoUsuario = new User({
      //user
      email:email,
      password:password,
      //admin:admin,
      //image:image,
      //description:description,
      //country:country,
      log_Google:true
  });
    await nuevoUsuario.save();
    sendMailActivateGoogle(password,email)
    return res
      .status(201)
      .json({ status: "usuario registrado mediante Google y guardado en la base de datos." });
  } catch (error) {
     return res.status(500).json({ status:"El usuario desde Google ya se registró en la base de datos." });
  }
};

const putUser = async (req, res) => {
  const { idUser } = req.params;
  const { name, email, password, admin, image, description, country } =
    req.body;
  let actualCliente;
  password
    ? (actualCliente = {
        name: name,
        email: email,
        password: await bcrypt.hash(password, 10),
        admin: admin,
        image: image,
        description: description,
        country: country,
      })
    : (actualCliente = {
        name: name,
        email: email,
        admin: admin,
        image: image,
        description: description,
        country: country,
      });
  await User.findByIdAndUpdate(idUser, actualCliente);
  res.status(200).json({
    status: "Usuario actualizado.",
  });
};

const putUserBook = async (req, res) => {
  const { idBook, idUser } = req.params;
  const sellingBooksUpdate = await User.findByIdAndUpdate(idUser, {
    $push: { selling_books: idBook },
  });

  const bookUpdated = await Book.findByIdAndUpdate(idBook, {
    $push: { sellers: idUser },
  });

  res.status(200).json({
    status: sellingBooksUpdate,
    statusBook: bookUpdated,
  });
  // en POSTMAN PUT:
  // http://localhost:3000/users/acavaelidObtenidodesdeMongoDB
};

const putUserWishList = async (req, res) => {
  const { idBook, idUser } = req.params;
  await User.findByIdAndUpdate(idUser, {
    $push: { wish_list: idBook },
  });
  res.status(200).json({
    status: "Libro agregado a wish list",
  });
};

const deleteUser = async (req, res) => {
  const { idUser } = req.params;
  try {
    await User.findByIdAndRemove(idUser, { useFindAndModify: false });
    return res.status(200).json({ status: "Usuario eliminado" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports = {
  getUsers,
  getUserByID,
  postUserGoogle,
  putUser,
  putUserBook,
  deleteUser,
  putUserWishList,
};
