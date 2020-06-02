const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const cors = require('cors');

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
// applied cors
app.use(cors(corsOptions));

// for parsing application/xwww-
app.use(bodyParser.urlencoded({extended: false}));

// for parsing application/json
app.use(bodyParser.json()); 

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}!`);
});