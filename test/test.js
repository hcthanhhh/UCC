// http = require("axios");



// http({
//     method: 'post',
//     url: 'http://localhost:3000/api/CloneGit', 
//     data: {
//         'name': 'pacman',
//         'username': 'hcthanh',
//         'url': 'https://github.com/hcthanhhh/ezpacman.git'
//     },
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })
//     .then((res) => {
//         console.log("res: ", res);
//     })
//     .catch((err) => {
//         console.log("err: ", err);
//     });

const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
})