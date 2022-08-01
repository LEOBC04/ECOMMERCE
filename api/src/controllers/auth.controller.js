const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const {
  sendMailActivate,
  sendMailForgot,
} = require("./sendMail.controller.js");
const nodemailer = require("nodemailer");
const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email }))
      return res
        .status(400)
        .json({ error: "El usuario con este email ya existe" });

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACC_ACTIVATE,
      { expiresIn: "20m" }
    );

    sendMailActivate(token, email);
    res.status(200).json({
      auth: "Email de verificacion enviado, por favor revise su bandeja",
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const activateAccount = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACC_ACTIVATE,
      function (err, decodedToken) {
        if (err) {
          return res.status(400).json({ error: "Incorrect or Expired link." });
        }

        const { name, email, password } = decodedToken;
        User.findOne({ email }).exec(async (err, user) => {
          if (user) {
            //if user exists in Database ...
            return res
              .status(400)
              .json({ error: "User with this email already exists." });
          } // if not, i start creating a new user
          let newUser = new User({ name, email, password: await bcrypt.hash(password, 10) });
          newUser.save((err, success) => {
            if (err) {
              console.log("Error in signup while account activation: ", err);
              return (
                res.status(400).json({ error: "Error activating account" })
              );
            }
            res.json({
              message: "Signup success",
            });
          });
        });
      }
    );
  } else {
    return res.json({ error: "Something went wrong!!!" });
  }
};

const login = async (req, res) => {
  const {email, password} = req.body

  if (await User.findOne({email}) === null) return res.status(400).json({error: "Email no registrado"})

  const user = await User.findOne({email});
  console.log(user);
  console.log(user.log_Google)
  if (user.log_Google===true) {
    if (password==user.password){
      const token=jwt.sign({ _id: User._id }, process.env.RESET_PASSWORD_KEY, {
        expiresIn: "20m",
      });
      await User.findOneAndUpdate(
        {email},
        {localStorageToken:token}
        // el token que se ve aqui ↑ es un token pasado de un inicio de sesion previo. No el nuevo.
      )
      console.log("el token para que vaya al local storage es :",token)
      return res.status(200).json({auth:"Usuario logueado mediante Google Login.",user,TokenParaLocalStorage:token});
    } else {
      return res.status(400).json({auth:"Contraseña incorrecta",user})
    }
  } else {
      const compare = await bcrypt.compare(password, user.password)
      console.log("🚀 ~ file: auth.controller.js ~ line 78 ~ login ~ compare", compare)

      if (!compare) return res.status(400).json({error: "Contraseña invalida"})

      const token = jwt.sign({id: user._id, name: user.name, email: user.email, admin: user.admin},process.env.JWT_ACC_ACTIVATE);

      res.status(200).json({auth: "Usuario logueado tradicionalmente", token:token, email:user.email})
  }

    /*
    res.status(200).json({auth: "Usuario logueado", token})*/
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if ((await User.findOne({ email })) === null)
    return res
      .status(400)
      .json({ error: "User with this email does not exists." });

  const token = jwt.sign({ _id: User._id }, process.env.RESET_PASSWORD_KEY, {
    expiresIn: "20m",
  });

  await User.findOneAndUpdate(
    { email },
    {
      resetLink: token,
    }
  );

  sendMailForgot(token, email);

  res.status(200).json({ auth: "Email enviado" });

};

const resetPassword = async (req, res) => {
  const { resetLink, newPass } = req.body;
  try {
    const compare = jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY);

    if (!compare)
      return res
        .status(400)
        .json({ error: "Incorrect token or it is expired" });

    if (await User.findOne({resetLink}) === null) return res.status(400).json({error: "Incorrect token or it is expired"})

    await User.findOneAndUpdate(
      { resetLink },
      {
        password: await bcrypt.hash(newPass, 10)
      }
    );
    
    await User.findOneAndUpdate({resetLink},
        {
            resetLink: ""
        }
    )

    res.status(200).json({ auth: "Contraseña cambiada" });
  } catch (err) {
    res.status(400).json(err);
  }

};

module.exports = {
  signUp,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
};
