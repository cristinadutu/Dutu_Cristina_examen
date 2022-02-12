
const express = require('express');
const sequelize = require('./sequelize')
const cors = require('cors');


const app = express();
const port = 8080;

app.use(express.json());
app.use(cors())

//UTILIZARE ROUTERE
app.use('/api', require('./routes/article-routes'));
app.use('/api', require('./routes/reference-routes'));
app.use('/sync', require('./routes/sync'));



app.listen(port, async () => {
    console.warn(`Server started on http://localhost:${port}`);
    try {
        await sequelize.authenticate();
        console.warn('Connection has been established successfully');
      } catch (error) {
        console.error('Unable to connect to the database: ', error);
      }
})