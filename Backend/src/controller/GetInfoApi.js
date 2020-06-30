const fs = require('fs');
const path = require('path');
const util = require('util');
const { request } = require('http');
const { resolveSoa } = require('dns');
const exec = util.promisify(require('child_process').exec);

exports.GetSLOC = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    fs.createReadStream(`../data/result/${username}/${name}/outfile_summary.csv`)
        .pipe(csv())
        .on('error', (err) => res.status(403).send({message: err}))
        .on('data', row => {
            if (row['0'] == 'Total');
            result = parseInt(row['2']) + parseInt(row['3']);
        })
        .on('end', () => res.status(200).send({SLOC: result}));
}

exports.GetREADME = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log("Get README.md: ", username, name);
    check = '';

    fs.readdir(`../data/${username}/${name}`, (err, files) => {
        if (err) {
            console.log(err);
            res.status(404).send({ message: "Error" });
            return;
        }
        if (files.includes('README.md')) {
            res.set('Content-Type', 'text/plain');
            res.status(200).sendFile(path.resolve(`../data/${username}/${name}/README.md`));
            console.log('Success');
            return;
        }
        if (files.length == 1) {
            check = files[0];
            fs.readdir(`../data/${username}/${name}/${check}`, (err, file) => {
                if (err) {
                    res.status(404).send({ message: "Error" });
                    return;
                }
                if (file.includes('README.md')) {
                    res.set('Content-Type', 'text/plain');
                    res.status(200).sendFile(path.resolve(`../data/${username}/${name}/${check}/README.md`));
                    console.log('Success');
                }
                else {
                    console.log('README.md not found');
                    res.status(403).send({ message: "README.md not found" });
                }
                return;
            })
        } else {
            console.log('README.md not found');
            res.status(403).send({ message: "README.md not found" });
        }
    })
}

exports.GetlistFile = async (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log("Get list Files: ", username, name);

    try {
        // exec(`touch ../data/${username}/${name}/listFile.txt`);
        await exec(`tree ../data/${username}/${name} > ../data/${username}/${name}/fileList.txt`);
        await exec(`tail -n +2 ../data/${username}/${name}/fileList.txt > ../data/result/${username}/${name}/fileList.txt`);
        res.set('Content-Type', 'text/plain');
        res.status(200).sendFile(path.resolve(`../data/result/${username}/${name}/fileList.txt`));
        console.log('Success');
    } catch (err) {
        console.log("Error: ", err);
        res.send(404).send({ message: 'Error' });
    }
}
