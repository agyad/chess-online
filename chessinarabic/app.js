const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const superadminRoute = require('./routes/superadminRouter');
const loginRoute = require('./routes/loginRouter');
const signupRoute = require('./routes/signupRouter');
const gamesRoute = require('./routes/gamesRouter');
const playRoute = require('./routes/playRouter');
const meRoute = require('./routes/meRouter');
const openingsRoute = require('./routes/openingsRouter');
const authControllers = require('./controllers/authControllers');
const app = express();

const HomePage = fs.readFileSync(__dirname + '/public/home.html', 'utf-8');

// 1 - middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}
app.use(express.static(__dirname + '/public'));

// 2 - Routes
app.use(
  '/chessinarabic/superadmin',
  authControllers.isAdminloged,
  superadminRoute
);
app.use('/chessinarabic/openings', authControllers.isloged, openingsRoute);
app.use('/chessinarabic/game', authControllers.isloged, gamesRoute);
app.use('/chessinarabic/login', authControllers.isloged, loginRoute);
app.use('/chessinarabic/signup', authControllers.isloged, signupRoute);
app.use('/chessinarabic/play', authControllers.isloged, playRoute);
app.use('/chessinarabic/me', authControllers.isloged, meRoute);

app.route('/chessinarabic').get(authControllers.isloged, (req, res) => {
  let ResponeFile = HomePage;
  if (req.IS_LOGED) {
    ResponeFile = ResponeFile.replace(/%hide-login%/g, 'hide-login');
    ResponeFile = ResponeFile.replace(
      /{%username%}/g,
      req.CURRENTUSER.username
    );
    ResponeFile = ResponeFile.replace(/Display-User-Name/g, ' ');
  }
  res.status(200).send(ResponeFile);
});
app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

// 3 - export express
module.exports = app;
