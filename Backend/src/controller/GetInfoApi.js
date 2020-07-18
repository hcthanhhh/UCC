const fs = require('fs');
const path = require('path');
const util = require('util');
const csv = require('csv-parser');
const exec = util.promisify(require('child_process').exec);
const getSize = require('get-folder-size');

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
        await exec(`tree '../data/${username}/${name}' > '../data/${username}/${name}/fileList.txt'`);
        await exec(`tail -n +2 '../data/${username}/${name}/fileList.txt' > '../data/result/${username}/${name}/fileList.txt'`);
        res.set('Content-Type', 'text/plain');
        res.status(200).sendFile(path.resolve(`../data/result/${username}/${name}/fileList.txt`));
        console.log('Success');
    } catch (err) {
        console.log("Error: ", err);
        res.send(404).send({ message: 'Error' });
    }
}

exports.GetResultUCC = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    check = true;
    result = [];

    console.log("GetResultUCC: ", username, name);

    fs.createReadStream(`../data/result/${username}/${name}/TOTAL_outfile.csv`)
        .pipe(csv())
        .on('error', (err) => {
            console.log('Error');
            res.status(403).send({ 'message': err });
        })
        .on('data', row => {
            if (check) {
                myrow = JSON.stringify(row);
                console.log(myrow);
                if (myrow.includes("RESULTS FOR ALL NON-WEB LANGUAGE FILES")) {
                    check = false;
                    result.push({ '0': 'RESULTS FOR ALL NON-WEB LANGUAGE FILES' })
                }
            }
            else result.push(row);
        })
        .on('end', () => {
            console.log(result);
            console.log("Success");
            res.status(200).send(result);
        })
}

exports.GetSLOC = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log('getSLOC: ', username, name);

    check = true;
    jsonStr = '{"Type":[], "SLOC":0}';
    result = JSON.parse(jsonStr);
    console.log(result);

    fs.createReadStream(`../data/result/${username}/${name}/outfile_summary.csv`)
        .pipe(csv())
        .on('error', (err) => reject(err))
        .on('data', row => {
            if (check) {
                if (row["0"] == "Name") check = 0;
                console.log(row);
            }
            else if (row["0"] != null) {
                console.log(row);
                temp = {
                    Language: row["0"],
                    detail: {
                        amount: parseInt(row["1"]),
                        PhysicalSLOC: parseInt(row["2"]),
                        LogicalSLOC: parseInt(row["3"])
                    }
                };
                result['Type'].push(temp);
            }
            if (row["0"] == "Total")
                result["SLOC"] = parseInt(row['3']);
        })
        .on('end', () => res.status(200).send(result));
}

exports.GetSLOCandSize = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log('getSLOC: ', username, name);

    check = true;
    jsonStr = '{"Type":[], "SLOC":0}';
    result = JSON.parse(jsonStr);
    console.log(result);

    fs.createReadStream(`../data/result/${username}/${name}/outfile_summary.csv`)
        .pipe(csv())
        .on('error', (err) => reject(err))
        .on('data', row => {
            if (check) {
                if (row["0"] == "Name") check = 0;
                console.log(row);
            }
            else if (row["0"] != null) {
                console.log(row);
                temp = {
                    Language: row["0"],
                    detail: {
                        amount: parseInt(row["1"]),
                        PhysicalSLOC: parseInt(row["2"]),
                        LogicalSLOC: parseInt(row["3"])
                    }
                };
                result['Type'].push(temp);
            }
            if (row["0"] == "Total")
                result["SLOC"] = parseInt(row['3']);
        })
        .on('end', () => res.status(200).send(result));
}

exports.getUserSize = async (req, res) => {
    let request = req.body;
    let username = request.username;

    getSize(`../data/${username}`, (err, size) => {
        if (err) res.status(403).send({ 'message': err });
        else res.status(200).send({ 'size': size });
    })
}

exports.getProjectSize = async (req, res) => {
    let request = req.body;
    let username = request.username;
    let name = request.name;

    getSize(`../data/${username}/${name}`, (err, size) => {
        if (err) res.status(403).send({ 'message': err });
        else res.status(200).send({ 'size': size });
    })
}