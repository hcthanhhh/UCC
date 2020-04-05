const shell = require('node-powershell');
const download = require('download-git-repo');
const express = require('express');

var app = express();

var PORT = 3000;

function downloadGit(username, url, number) {
        download('direct:' + url, 'data/' + username + '/' + number, { clone: true }, (res) => {
            console.log("res: ", res);
        });
}

function UCC(username, number) {
    let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });
    ps.addCommand('cd data/' + username);
    // ps.addCommand('../UCC/UCC/Release/UCC -dir D:/Final_Project/ucc_2015.12/ucc_2015.12/src/ *.cpp *.h')
    ps.addCommand('../../UCC/UCC -dir ./data/' + username + '/' + number);
    // ----- How to use ps.addParameter -----
    // ps.addParameter({dir: 'D:/Final_Project/ucc_2015.12/ucc_2015.12/src *.cpp *.h'})

    ps.invoke().then(output => {
        console.log("Result: ", output);
    })
}

app.post('/UCC', async (req, res) => {
    var username = req.body.username;
    var url_git = req.body.url;
    var number = req.body.number
    await downloadGit(username, url_git, number);
    await UCC(username, number);
    res.sendfile("./data/" + username + "/")
    
})

app.listen(PORT, () => {
    console.log('Server is running on PORT: ', PORT)
})