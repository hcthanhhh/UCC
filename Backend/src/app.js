const express = require('express');
const bodyParser = require('body-parser')
const router = require('./routers');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}!`);
});