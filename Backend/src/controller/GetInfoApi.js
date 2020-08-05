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
                "Ratio": {
                    'Low': 0,
                    'Medium': 0,
                    'High': 0,
                }
            },
            "Result by Function": {
                "listFunction": [],
                "Ratio": {
                    'Low': 0,
                    'Medium': 0,
                    'High': 0,
                }
            },
            "total": {},
            "average": {},
        };
        check = 0;
        ntemp = 0;
        temp = [];
        risk = 0;
        filename = 0;
        countFile = 0;
        countFunction = 0;
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
                    else if (row['0'].includes('RESULTS BY FUNCTION')) {
                        check = 1;
                        temp = [];
                        ntemp = 0;
                    }
                    else if (row['0'].includes('Cyclomatic')) { }
                    else if (row[risk].includes('Totals')) {
                        if (check) {
                            a = '{';
                            for (i = 0; i < risk; i++) {
                                a += `"${temp[i]}":"${row[i]}",`
                            }
                            a = a.substr(0, a.length - 1);
                            a += '}';
                            result["total"] = JSON.parse(a);
                            result["total"] = {
                                ...result["total"],
                                'functions': countFunction,
                                'files': countFile,
                            }
                        }
                    }
                    else if (row[risk].includes('Average')) {
                        if (check) {
                            a = '{';
                            for (i = 0; i < risk; i++) {
                                a += `"${temp[i]}":"${row[i]}",`
                            }
                            a = a.substr(0, a.length - 1);
                            a += '}';
                            result["average"] = JSON.parse(a);
                            result["average"] = {
                                ...result["average"],
                                'functions per file': countFunction / countFile,
                            }
                        }
                    }
<<<<<<< HEAD
                    else if (filename != 0 && risk != 0) {
                        row[filename] = row[filename].substr(13 + username.length + name.length, row[filename].length);
=======
                    else {
                        if (row[filename] == null && row[filename - 1] != null) {
                            row[filename - 1] = row[filename - 1].replace('"', '');
                            row[filename] = row[filename - 1].substr(row[filename - 1].indexOf(',') + 1, row[filename - 1].length);
                            row[filename - 1] = row[filename - 1].substr(0, row[filename - 1].indexOf(','));
                        }
                        row[filename] = row[filename].substr(10 + username.length + name.length, row[filename].length);
>>>>>>> 092f33d471fa5c53c0b9cf3ccc912aab4a508ef4
                        a = '{';
                        for (i = 0; i < ntemp; i++) {
                            a += `"${temp[i]}":"${row[i].replace('"', '')}",`
                        }
                        a = a.substr(0, a.length - 1);
                        a += '}';
                        if (!check) {
                            countFile += 1;
                            switch (row[risk]) {
                                case 'Low': result["Result by File"]["Ratio"]["Low"] += 1; break;
                                case 'Medium': result["Result by File"]["Ratio"]["Medium"] += 1; break;
                                case 'High': result["Result by File"]["Ratio"]["High"] += 1; break;
                            }
                            result['Result by File']['listFile'].push(JSON.parse(a));
                        }
                        else {
                            countFunction += 1;
                            switch (row[risk]) {
                                case 'Low': result["Result by Function"]["Ratio"]["Low"] += 1; break;
                                case 'Medium': result["Result by Function"]["Ratio"]["Medium"] += 1; break;
                                case 'High': result["Result by Function"]["Ratio"]["High"] += 1; break;
                            }
                            result['Result by Function']['listFunction'].push(JSON.parse(a));
                        }
                    }
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
        result = {
            "Ratio Result by File": {
                "Low": 0,
                "Medium": 0,
                "High": 0
            },
            "Ratio Result by Function": {
                "Low": 0,
                "Medium": 0,
                "High": 0
            }
        };
        check = 0;
        risk = 0;
        fs.createReadStream(`../data/result/${username}/${name}/outfile_cyclomatic_cplx.csv`)
            .pipe(csv())
            .on('error', (err) => reject(err))
            .on('data', row => {
                if (row["0"] != null) {
                    if (row["0"].includes('CC1')) {
                        ntemp = 0;
                        while (row[ntemp] != undefined) {
                            if (row[ntemp].includes("Risk")) risk = ntemp;
                            ntemp++;
                        }
                    }
                    else if (row['0'].includes('RESULTS BY FUNCTION')) {
                        check = 1;
                        ntemp = 0;
                    }
                    if (row[risk] != null) {
                        if (!check)
                            switch (row[risk]) {
                                case 'Low': result["Ratio Result by File"]["Low"] += 1; break;
                                case 'Medium': result["Ratio Result by File"]["Medium"] += 1; break;
                                case 'High': result["Ratio Result by File"]["High"] += 1; break;
                            }
                        else
                            switch (row[risk]) {
                                case 'Low': result["Ratio Result by Function"]["Low"] += 1; break;
                                case 'Medium': result["Ratio Result by Function"]["Medium"] += 1; break;
                                case 'High': result["Ratio Result by Function"]["High"] += 1; break;
                            }
                    }
                }
            })
            .on('end', () => {
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