const fs = require('fs');
const path = require('path');
const util = require('util');
const csv = require('csv-parser');
const exec = util.promisify(require('child_process').exec);
const getSize = require('get-folder-size');
const { UV_FS_O_FILEMAP } = require('constants');

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
                if (myrow.includes("RESULTS FOR ALL NON-WEB LANGUAGE FILES")) {
                    check = false;
                    result.push({ '0': 'RESULTS FOR ALL NON-WEB LANGUAGE FILES' })
                }
            }
            else result.push(row);
        })
        .on('end', () => {
            console.log("Success");
            res.status(200).send(result);
        })
}

exports.GetSLOCandSize = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log('getSLOC: ', username, name);

    check = true;
    jsonStr = '{"Type":[], "SLOC":0}';
    result = JSON.parse(jsonStr);

    fs.createReadStream(`../data/result/${username}/${name}/outfile_summary.csv`)
        .pipe(csv())
        .on('error', (err) => reject(err))
        .on('data', row => {
            if (check) {
                if (row["0"] == "Name") check = 0;
            }
            else if (row["0"] != null) {
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

exports.GetSLOC = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log('getSLOC: ', username, name);

    check = true;
    jsonStr = '{"SLOC":0}';
    result = JSON.parse(jsonStr);

    fs.createReadStream(`../data/result/${username}/${name}/outfile_summary.csv`)
        .pipe(csv())
        .on('error', (err) => reject(err))
        .on('data', row => {
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

function GetCyclomaticResultFormatted(username, name) {
    return new Promise((resolve, reject) => {
        result = {
            "Result by File":
            {
                "listFile": [],
                "total": {
                    "function": 0,
                    "file": 0,
                },
                "Average": {
                    "function": 0,
                    "file": 0,
                },
                "Ratio": {}
            },
            "Result by Function": {
                "listFunction": [],
                "total": {
                    "function": 0,
                    "file": 0,
                },
                "Average": {
                    "function": 0,
                    "file": 0,
                },
                "Ratio": {}
            },
        };
        console.log(result);
        check = 0;
        low = 0;
        medium = 0;
        high = 0;
        ntemp = 0;
        temp = [];
        risk = 0;
        filename = 0;
        fs.createReadStream(`../data/result/${username}/${name}/outfile_cyclomatic_cplx.csv`)
            .pipe(csv())
            .on('error', (err) => reject(err))
            .on('data', row => {
                if (row['0'] != null) {
                    if (row["0"].includes('CC1')) {
                        ntemp = 0;
                        while (row[ntemp] != undefined) {
                            temp.push(row[ntemp]);
                            if (row[ntemp].includes("Risk")) risk = ntemp;
                            if (row[ntemp].includes("File Name")) filename = ntemp;
                            ntemp++;
                        }
                    }

                    row['0'] = row['0'].trim();
                    if (row['0'].includes('RESULTS BY FUNCTION')) {
                        check = 1;
                        result["Result by File"]["Ratio"] = {
                            'Low': low,
                            'Medium': medium,
                            'High': high
                        };
                        low = 0;
                        medium = 0;
                        high = 0;
                        temp = [];
                        ntemp = 0;
                    }
                }

                myrow = JSON.stringify(row);
                if (row[filename] != null && row[filename].includes('/') && (!row[filename].includes('Totals/Functions')))
                    row[filename] = row[filename].substr(row[filename].lastIndexOf("/") + 1, row[filename].length);


                //Get Ratio
                if (row[risk] != null)
                    switch (row[risk]) {
                        case 'Low': low += 1; break;
                        case 'Medium': medium += 1; break;
                        case 'High': high += 1; break;
                    }
                if (row[risk] != null)
                    switch (row[risk]) {
                        case 'Low': low += 1; break;
                        case 'Medium': medium += 1; break;
                        case 'High': high += 1; break;
                    }
                //Get Ratio

                if ((row[risk] != null) && (row[risk].includes('Low') || row[risk].includes('Medium') || row[risk].includes('High'))) {
                    console.log(row)

                    jsonStr = '{';
                    for (i = 0; i < ntemp; i++) {
                        jsonStr += '"' + temp[i] + '":"' + row[i] + '",'
                    }
                    jsonStr = jsonStr.slice(0, jsonStr.length - 1);
                    jsonStr += '}';
                    resultPush = JSON.parse(jsonStr);
                    if (!check) result["Result by File"]['listFile'].push({
                        resultPush
                    })
                    else result["Result by Function"]['listFunction'].push({
                        resultPush
                    })
                }

            })
            .on('end', () => {
                resolve(result);
            })
    })
}


function GetCyclomaticResult(username, name) {
    return new Promise((resolve, reject) => {
        result = [];
        low = 0;
        medium = 0;
        high = 0;
        fs.createReadStream(`../data/result/${username}/${name}/outfile_cyclomatic_cplx.csv`)
            .pipe(csv())
            .on('error', (err) => reject(err))
            .on('data', row => {
                if (row['4'] != null)
                    switch (row['4']) {
                        case 'Low': low += 1; break;
                        case 'Medium': medium += 1; break;
                        case 'High': high += 1; break;
                    }
                if (row['2'] != null)
                    switch (row['2']) {
                        case 'Low': low += 1; break;
                        case 'Medium': medium += 1; break;
                        case 'High': high += 1; break;
                    }
                myrow = JSON.stringify(row);
                if (myrow.includes("RESULTS BY FILE")) {
                    result.push({ '0': 'RESULTS BY FILES' });
                    result.push({ '0': "Cyclomatic Complexity" });
                }
                if (row['5'] != null && row['5'].includes('/') && (!row['5'].includes('Totals/Functions')))
                    row['5'] = row['5'].substr(row['5'].lastIndexOf("/"), row['5'].length);
                if (row['0'] != null) {
                    row['0'] = row['0'].trim();
                    if (row['0'].includes('RESULTS BY FUNCTION')) {
                        result.push({
                            'Ratio Result By Files': {
                                'Low': low,
                                'Medium': medium,
                                'High': high
                            }
                        });
                        low = 0;
                        medium = 0;
                        high = 0;
                    }
                    result.push(row);
                }
            })
            .on('end', () => {
                result.push({
                    'Ratio Result by Function': {
                        'Low': low,
                        'Medium': medium,
                        'High': high
                    }
                })
                resolve(result);
            })
    })
}

function GetRatioCyclomaticResult(username, name) {
    return new Promise((resolve, reject) => {
        result = [];
        low = 0;
        medium = 0;
        high = 0;
        fs.createReadStream(`../data/result/${username}/${name}/outfile_cyclomatic_cplx.csv`)
            .pipe(csv())
            .on('error', (err) => reject(err))
            .on('data', row => {
                if (row['4'] != null)
                    switch (row['4']) {
                        case 'Low': low += 1; break;
                        case 'Medium': medium += 1; break;
                        case 'High': high += 1; break;
                    }
                if (row['2'] != null)
                    switch (row['2']) {
                        case 'Low': low += 1; break;
                        case 'Medium': medium += 1; break;
                        case 'High': high += 1; break;
                    }
                if (row['0'] != null) {
                    row['0'] = row['0'].trim();
                    if (row['0'].includes('RESULTS BY FUNCTION')) {
                        result.push({
                            'Ratio Result By Files': {
                                'Low': low,
                                'Medium': medium,
                                'High': high
                            }
                        });
                        low = 0;
                        medium = 0;
                        high = 0;
                    }
                }
            })
            .on('end', () => {
                result.push({
                    'Ratio Result by Function': {
                        'Low': low,
                        'Medium': medium,
                        'High': high
                    }
                })
                resolve(result);
            })
    })
}
exports.CyclomaticFormatted = async (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log('Cyclomatic: ', username, name);
    try {
        result = await GetCyclomaticResultFormatted(username, name);
        console.log('Success');
        res.status(200).send(result);
    } catch (error) {
        console.log('Error');
        res.status(200).send({ message: 'No Result' });
    }
}


exports.Cyclomatic = async (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log('Cyclomatic: ', username, name);
    try {
        result = await GetCyclomaticResult(username, name);
        console.log('Success');
        res.status(200).send(result);
    } catch (error) {
        console.log('Error');
        res.status(200).send({ message: 'No Result' });
    }
}

exports.RatioCyclomatic = async (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log('Ratio of Cyclomatic: ', username, name);
    try {
        result = await GetRatioCyclomaticResult(username, name);
        console.log('Success');
        res.status(200).send(result);
    } catch (error) {
        console.log('Error');
        res.status(200).send({ message: 'No Result' });
    }
}