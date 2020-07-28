const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3550;
const connectDb = require('./config/db')

connectDb();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/user', require('./routes/api/user'))
app.use('/', require('./routes/api'))

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})