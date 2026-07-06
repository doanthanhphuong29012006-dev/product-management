const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
require('dotenv').config();

const database = require("./config/database");
const systemConfig = require('./config/system');

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

//Flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//End Flash

const routeAdmin = require('./routes/admin/index.route');
const route = require('./routes/client/index.route');

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//App Local Variables

app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

app.use(async (req, res, next) => {
    await database.connect();
    next();
});

//Routes
routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});