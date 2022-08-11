const express = require("express");
const {
  getUsers,
  getUserByID,
  postUserGoogle,
  putUser,
  putUserBook,
  deleteUser,
  putUserWishList,
  getStats,
  purchasedBooks,
  becomeAdmin
} = require("../controllers/user.controller.js");

const { isAdmin, verifyToken } = require("../middlewares/auth.middleware")

const router = express.Router();

router.get("/", getUsers);

router.get("/stats", [verifyToken, isAdmin], getStats)


router.get("/:idUser", getUserByID);

router.post("/registerGoogle", postUserGoogle);

router.put("/admin", becomeAdmin)

router.put('/purchasing-books/:idUser', purchasedBooks);

router.put("/updatewishlist/:idUser", putUserWishList)

router.put("/:idUser/:idBook", putUserBook);

router.put("/update/wishlist/:idUser", putUserWishList)
router.put("/:idUser", putUser);

router.delete("/:idUser", deleteUser);




module.exports = router;
