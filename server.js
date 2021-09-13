const path = require('path');
const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const exhbs = require('express-handlebars');
const hbs = exhbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

//sync method to establish db connection...if it does not find a table it will create one for you
//force: true same as drop table if exists..can b annoying
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () =>  console.log('Now listening'));
});
