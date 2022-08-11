const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index.routes.js");
const cors = require("cors")

const app = express();

// (MIDDLEWARES)
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({
  limit: "50mb",
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors())
app.use((req, res, next) => {

  //console.log(req.cookies);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});


app.use('/', routes);

/*const isAuthenticated = (req, res, next) => {
  let { userID } = req.cookies;
  // me fijo tengo un usuario con dicho ID
  // si no me vino por req.cookies, no me va a encontrar ningun usuario igak
  // const user= users.find(u=> parseInt(userID)===u.id)
  const user = users.find(u => userID === u.id.toString())
  if (user) { console.log('isAuthenticated'); return res.redirect('/home'); }
  console.log('isNotAuthenticated');
  next();
}

// Hagamos un middleware que verifique que no esta autenticado.
const isNotAuthenticated = (req, res, next) => {
  let { userID } = req.cookies;
  const user = users.find(u => userID === u.id.toString());
  if (!user) res.redirect('/login');
  next();
};
// (MAIN ROUTE)
//app.use("/", routes);

app.get('/', (req, res) => {
  // si estuviese loggeado aca encontraria las cookies, req.cookies
  let { userID } = req.cookies;
  res.send(`
    <h1>Bienvenidos a Henry!</h1>
    ${userID ? `
      <a href='/home'>Perfil</a>
      <form method='post' action='/logout'>
        <button>Salir</button>
      </form>
      `
      : `
      <a href='/login'>Ingresar</a>
      <a href='/register'>Registrarse</a>
      `}
  `)
});


app.get('/login', isAuthenticated, (req, res) => {
  // get muestra el formulario de log in
  // post es quien efectivamente intenta de autenticar a la persona
  res.send(`
          <h1>Iniciar sesion</h1>
          <form method='post' action='/login'>
              <input type='email' name='email' placeholder='email' required />
              <input type='password' name='password' placeholder='password' required>
              <input type='submit' value='Ingresar'/>
          </form>
          <a href='/register'>Registrarse</a>
          `)
})


app.post('/login', (req, res) => {
  console.log('post to /logging');
  const { email, password } = req.body;
  if (email && password) {
    const user = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    // Diego@gmail.com === diego@gmail.com
    if (user.id) {
      // si ya el usuario ya inició sesión, no le volvamos a pedir que lo haga.
      res.cookie('userID', user.id); // (como se llama y que es lo que quiero que guarde.)
      res.redirect('/home');

    } else {
      res.redirect('/login');
    }
  }
});


app.get('/home', isNotAuthenticated, (req, res) => {
  const { userID } = req.cookies;
  const user = users.find(u => u.id.toString() === userID);
  // if (!user)  // do something
  res.send(`
  <h1>BIENVENIDO ${user.name}</h1>
  <h2>${user.email}</h2>
  <a href='/'>Inicio</a>`)
})

app.get('/register', isAuthenticated, (req, res) => {
  res.send(`
    <h1>Registrarse</h1>
    <form method='post' action='/register'>
      <input name='name' placeholder='Nombre' required />
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type='submit' value='Registrarse' />
    </form>
    <a href='/login'>Iniciar sesión</a>
  `)
})


app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  // debo verificar si el email ya no esta registrado...
  const user = users.find(u => u.email === email);
  if (user || (!name || !password || !email)) {
    res.redirect('/register');
  } else {
    // reemplazamos el push por algo que nos permita insertarlo en la base de datos de usuarios.
    users.push({
      id: users.length + 1,
      email,
      name,
      password
    });
  }
  res.redirect('/');
})


app.post('/logout', (req, res) => {
  console.log('Hice post a /logout');
  res.clearCookie('userID');
  res.redirect('/');
})*/


/*app.listen(3000, (err) => {
  if(err) {
   console.log(err);
 } else {
   console.log('Listening on localhost:3000');
 }
});*/

module.exports = app;
