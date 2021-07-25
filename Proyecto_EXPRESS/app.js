//1-Invocacion EXPRESS y otras librerias
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var hbs = require('express-handlebars');
var bcrypt = require('bcrypt')
const session = require('express-session');
var app = express();
var nodemailer = require('nodemailer')


//2-Capturar datos formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Conexion Base de Datos
const myconfig = require('./config/config.js')
const mysql = require('mysql2');
const { url } = require('inspector');
const connection = mysql.createConnection(myconfig.mysql)
connection.connect((error) => {
  if (error) {
    console.error(error);
    process.exit();
  }
  console.log('Base de Datos Conectada');
});


app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout2',
  layoutsDir: 'views/layout',
  partialsDir: 'views/partials'
}));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//establecemos rutas
app.get('/', function (req, res, next) {
  res.render('login', { layout: 'layout' })
});

app.get('/register', function (req, res, next) {
  res.render('register', { layout: 'layout' })
});

app.get('/contact', function (req, res, next) {
  if (req.session.loggedIn) {
    return res.render('contact', {
      layout: 'layout2.hbs', title: 'Portal Ciberdefensa',
      name: req.session.name,
      surname: req.session.surname
    });
  } else {
    return res.render('contact', {
      alert: true,
      alertTitle: "Información",
      alertMessage: "¡Por favor debe iniciar sesión!",
      alertIcon: 'info',
      showConfirmButton: true,
      timer: false,
      ruta: ''
    });
  }
});

app.get('/addlink', function (req, res, next) {
  if (req.session.loggedIn) {
    return res.render('addlink', {
      layout: 'layout2.hbs', title: 'Portal Ciberdefensa',
      name: req.session.name,
      surname: req.session.surname
    });
  } else {
    return res.render('addlink', {
      alert: true,
      alertTitle: "Información",
      alertMessage: "¡Por favor debe iniciar sesión!",
      alertIcon: 'info',
      showConfirmButton: true,
      timer: false,
      ruta: ''
    });
  }
});

app.get('/about', function (req, res, next) {
  if (req.session.loggedIn) {
    return res.render('about', {
      layout: 'layout2.hbs', title: 'Portal Ciberdefensa',
      name: req.session.name,
      surname: req.session.surname
    });
  } else {
    return res.render('about', {
      alert: true,
      alertTitle: "Información",
      alertMessage: "¡Por favor debe iniciar sesión!",
      alertIcon: 'info',
      showConfirmButton: true,
      timer: false,
      ruta: ''
    });
  }
});

//REGISTRO
app.post('/register', async (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  let passwordHash = await bcrypt.hash(password, 8);
  connection.query('INSERT INTO usertable SET ?', { name: name, surname: surname, email: email, username: username, password: passwordHash }, async (error, results) => {
    if (error) {
      res.render('register', {
        layout: 'layout',
        alert: true,
        alertTitle: "Registración",
        alertMessage: "error",
        alertIcon: 'warning',
        showConfirmButton: false,
        timer: 10000,
        ruta: 'register'
      });
    } else {
      res.render('register', {
        layout: 'layout',
        alert: true,
        alertTitle: "Registración",
        alertMessage: "¡Registro Exitoso!",
        alertIcon: 'success',
        showConfirmButton: false,
        timer: 10000,
        ruta: ''
      });
    }
  });
})

//LOGEO
app.post('/auth', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let passwordHash = await bcrypt.hash(password, 8);
  if (username && password) {
    connection.query('SELECT * FROM usertable WHERE username=?', [username], async (error, results) => {
      if (results.length == 0 || !(await bcrypt.compare(password, results[0].password))) {
        res.render('login', {
          layout: 'layout',
          alert: true,
          alertTitle: "Error",
          alertMessage: "USUARIO y/o PASSWORD incorrectas",
          alertIcon: 'error',
          showConfirmButton: true,
          timer: false,
          ruta: ''
        });
      } else {
        req.session.loggedIn = true;
        req.session.name = results[0].name;
        req.session.surname = results[0].surname;
        req.session.userID = results[0].userID;
        res.render('login', {
          layout: 'layout',
          alert: true,
          alertTitle: "Conexión exitosa",
          alertMessage: "¡LOGIN CORRECTO!",
          alertIcon: 'success',
          showConfirmButton: false,
          timer: 1500,
          ruta: 'index'
        });
      }
    });
  } else {
    res.render('login', {
      layout: 'layout',
      alert: true,
      alertTitle: "Advertencia",
      alertMessage: "¡Por favor ingrese un usuario y contraseña!",
      alertIcon: 'warning',
      showConfirmButton: true,
      timer: 1500,
      ruta: ''
    });
  };
});


//CONTROL DE LOGEO
app.get('/index', function (req, res) {
  console.log(req.session.loggedIn);
  console.log(req.session.name, req.session.surname, req.session.userID);
  if (req.session.loggedIn) { //CONTROL DE LOGGEO
    connection.query('SELECT * FROM linkstable WHERE userTable_userID=?', [req.session.userID], function (err, results, fields) { //BUSCAMOS TODOS LOS LINKS DE LA BASE DE DATOS
      if (err) { throw err; }
      else {
        var links = results;
        console.log(results, links);
      };
    return res.render('index', {
      layout: 'layout2.hbs', title: 'Portal Ciberdefensa',
      name: req.session.name,
      surname: req.session.surname,
      links: links,
    });
  });
  } else {
  return res.render('', {
    alert: true,
    alertTitle: "Información",
    alertMessage: "¡Por favor debe iniciar sesión!",
    alertIcon: 'info',
    showConfirmButton: true,
    timer: false,
    ruta: ''
  });
}
});

//Añadir Panel
app.post('/panel', async (req, res) => {
  const sitename = req.body.sitename;
  const direccion = req.body.url;
  const description = req.body.description;
  const userID = req.session.userID;
  console.log(sitename, direccion, description, userID);
  connection.query('INSERT INTO linkstable (URL, description, sitename, userTable_userID) VALUES (?,?,?,?)', [direccion, description, sitename, userID], async (error, results) => {
    if (error) {
      console.log(error);
      return res.render('addlink', {
        layout: 'layout2.hbs',
        name: req.session.name,
        surname: req.session.surname,
        alert: true,
        alertTitle: "No se puede registrar el LINK",
        alertMessage: "Error",
        alertIcon: 'warning',
        showConfirmButton: true,
        timer: false,
        ruta: 'index'
      });
    } else {
      return res.render('addlink', {
        layout: 'layout2.hbs',
        name: req.session.name,
        surname: req.session.surname,
        alert: true,
        alertTitle: "Registro",
        alertMessage: "¡Registro Exitoso!",
        alertIcon: 'success',
        showConfirmButton: false,
        timer: 5000,
        ruta: 'index'
      });
    }
  });
});

//eliminar panel
app.get('/delete/:idlink', function (req, res) {
  const {idlink} = req.params;
  connection.query('DELETE FROM linkstable WHERE idlink = ?', [idlink]);
  res.redirect('/index');
});

//enviar mail
app.post('/send', function (req, res) {
  let nombreForm, apellidoForm, emailForm, telefonoForm, textoForm;
  nombreForm = req.body.nombre;
  apellidoForm = req.body.apellido;
  emailForm = req.body.email;
  telefonoForm = req.body.telefono;
  textoForm = req.body.texto;
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'alec.trantow81@ethereal.email',
        pass: 'S3CE75WPR5SX71zxsZ'
    },
    tls: {
      rejectUnauthorized: false
    },
  });
  var mailForm = {
    from: `${nombreForm} ${apellidoForm} <${emailForm}>`,
    to: "santiagosarchetti@gmail.com",
    subject: "Nuevo Contacto",
    text: `${textoForm}`
  };
  transporter.sendMail(mailForm, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email enviado");
      return res.render('contact', {
        alert: true,
        alertTitle: "Información",
        alertMessage: "¡Formulario de Contacto Enviado!",
        alertIcon: 'info',
        showConfirmButton: true,
        timer: 5000,
        ruta: 'index'
      });
    }
  });
})


app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
module.exports = app;