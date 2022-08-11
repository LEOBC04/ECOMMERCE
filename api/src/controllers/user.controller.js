const User = require("../models/User.js");
const Book = require("../models/Book.js");
const bcrypt = require("bcrypt");
const {GiftCardNotification} = require("./sendMail.controller");
const { getByName, getByEmail } = require("../lib/user.controller.helper.js");
const jwt = require('jsonwebtoken');


const getUsers = async (req, res) => {
  const { name, email } = req.query;
  try {
    let users = await User.find();
    if (name) users = getByName({ users, name });

    else if (email) users = getByEmail({ users, email });

    return res.status(200).json({ users: users });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const getUserByID = async (req, res) => {
  const { idUser } = req.params;
  try {
    const userrrsId = await User.findById(idUser)
      .populate("selling_books")
      .populate("purchased_books")
      .populate("wish_list")
    return res.status(200).json({ userrrs: userrrsId });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
  // en POSTMAN GET:
  // http://localhost:3000/users/acavaelidObtenidodesdeMongoDB
};



const postUserGoogle = async (req, res) => {
  const { email, password, image, name } = req.body;
  try {
    const nuevoUsuario = new User({

      email: email,
      password: password,
      image: image,
      name: name,

      log_Google: true
    });
    await nuevoUsuario.save();
    const user = await User.findOne({ email });
    const token = jwt.sign({ id: user._id, email, password, image, name }, process.env.JWT_ACC_ACTIVATE);


    res.status(201).json({ status: "usuario registrado mediante Google y guardado en la base de datos.", token });
  } catch (error) {

    const user = await User.findOne({ email });

    const token = jwt.sign({ id: user._id, email, password, image, name }, process.env.JWT_ACC_ACTIVATE);
    res.status(201).json({ status: "usuario registrado mediante Google y guardado en la base de datos.", token });
    // return res.status(500).json({ error: error });

  }
};

const putUser = async (req, res) => {
  const { idUser } = req.params;
  const { name, email, password, image, description, country } =
    req.body;
  let actualCliente;
  password
    ? (actualCliente = {
      name: name,
      email: email,
      password: await bcrypt.hash(password, 10),   
      image: image,
      description: description,
      country: country,
    })
    : (actualCliente = {
      name: name,
      email: email,    
      image: image,
      description: description,
      country: country,
    });
  await User.findByIdAndUpdate(idUser, actualCliente);
  res.status(200).json({
    status: "Usuario actualizado.",
  });
};

const becomeAdmin = async (req, res) => {
  const { idUser } = req.body
  try {
    const user = await User.findById(idUser)
    user.admin ? await user.updateOne({ admin: false }) : await user.updateOne({ admin: true })
    res.status(200).json({ status: "Usuario actualizado." })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

const putUserBook = async (req, res) => {
  const { idBook, idUser } = req.params;

  const BookPurch = await Book.findById(idBook);

  const sellingBooksUpdate = await User.findByIdAndUpdate(idUser, {
    // $push: { purchased_books: BookPurch.id },
    $push: { purchased_books: BookPurch._id },
  });

  const bookUpdated = await Book.findByIdAndUpdate(idBook, {
    $push: { buyer: idUser },
  });

  res.status(200).json({
    status: sellingBooksUpdate,
    statusBook: bookUpdated,
  });


  // en POSTMAN PUT:
  // http://localhost:3000/users/acavaelidObtenidodesdeMongoDB
};

const putUserWishList = async (req, res) => {
  const { idUser } = req.params;
  const { wishList } = req.body

  await User.findByIdAndUpdate(idUser, { wish_list: wishList });
  res.status(200).json({
    status: "wishList updated",
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

const purchasedBooks=async(req,res)=>{
  const {idUser}=req.params;
  const {cartQuantity,GiftCard,name}=req.body;
  if (GiftCard){
    console.log(`Se recibe una giftcard de ${GiftCard}`);
    const usuar= await User.findById(idUser)
    await usuar.updateOne({$inc:{available_money:GiftCard}})
    //await console.log(usuar.email);
    GiftCardNotification(usuar.email,GiftCard,name)

    res.status(200).json("La GiftCard ha sido activada")
  } else {

  vair= await cartQuantity.map(e=>{
    return {
      idLibro:e._id,
      cantidadLibro:e.cartQuantity,
      gastoPorLibro:e.price
    }});

await vair.map(async (e)=>{
    const usuar= await User.findById(idUser)
    usuar.available_money?
   await usuar.updateOne({$inc:{available_money:-(e.gastoPorLibro*e.cantidadLibro)}}):console.log('hola');
    const lib= await Book.findById(e.idLibro)
    lib.stock>0?
   await lib.updateOne({$inc:{stock:-(e.cantidadLibro)}}):
   console.log(`ya no hay stock de ${e.idLibro} para realizar la compra`);
   await User.findByIdAndUpdate(idUser, {
    $push: { purchased_books: e.idLibro },
  });
}
)
res.status(200).json({status:"todo bien"})
  }
}

module.exports = {
  getUsers,
  getUserByID,
  postUserGoogle,
  putUser,
  putUserBook,
  deleteUser,
  putUserWishList,
  becomeAdmin,
  purchasedBooks
};
