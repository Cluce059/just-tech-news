const express = require('express');

const routes = require('./routes');

const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routes);

//sync method to establish db connection...if it does not find a table it will create one for you
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () =>  console.log('Now listening'));
});
