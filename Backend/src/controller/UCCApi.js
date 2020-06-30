const fs = require('fs');
const csv = require('csv-parser');
const shell = require('node-powershell');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.UCCUrlWindows = async (req, res) => {
    request = req.body;
    console.log(request);
    username = req.body.username;
    name = req.body.name;
    console.log("UCC Windows: ", username, name);
    check = true;

    let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });

    await ps.addCommand(`./UCC/UCC -unified -dir ../data/${username}/${name} -outdir ../data/result/${username}/${name}`);
    await ps.invoke().then(output => console.log(`res: ${output}`));

    var result = []
    fs.createReadStream(`../data/result/${username}/${name}/TOTAL_outfile.csv`)
        .pipe(csv())
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
            console.log('Success');
            res.status(200).json(result);
        });
};

exports.UCCUrlMac = async (req, res) => {

    request = req.body;
    console.log(request);
    username = req.body.username;
    name = req.body.name;
    check = true;

    console.log("Run UCC: ", username, name);

    try {
        const { stdout, stderr } = await exec(`./UCC/UCC.mac -unified -dir ../data/${username}/${name} -outdir ../data/result/${username}/${name}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/result/${username}/${name}/TOTAL_outfile.csv`)
            .pipe(csv())
            .on('data', row => {
                if (check) {
                    myrow = JSON.stringify(row);
                    if (myrow.includes("RESULTS FOR ALL NON-WEB LANGUAGE FILES")) {
                        check = false;
                        result.push({ '0': 'RESULTS FOR ALL NON-WEB LANGUAGE FILES' });
                    }
                }
                else result.push(row);
            })
            .on('end', () => {
                check = true;
                fs.createReadStream(`../data/result/${username}/${name}/outfile_summary.csv`)
                    .pipe(csv())
                    .on('data', row => {
                        if (check) {
                            myrow = JSON.stringify(row);
                            if (myrow.includes('"0":"Language"')) {
                                check = false;
                                result.push({ '0': 'KLOC SUMMARY RESULTS' });
                                result.push(row);
                            }
                        }
                        else result.push(row);
                    })
                    .on('end', () => {
                        console.log('Success');
                        res.status(200).json(result);
                    })  
            });
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Error" });
    };
};

exports.UCCUrlLinux = async (req, res) => {

    request = req.body;
    username = req.body.username;
    name = req.body.name;

    console.log("Run UCC: ", username, name);
    check = true;

    try {
        const { stdout, stderr } = await exec(`./UCC/UCC.linux -unified -dir ../data/${username}/${name} -outdir ../data/result/${username}/${name}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/result/${username}/${name}/TOTAL_outfile.csv`)
            .pipe(csv())
            .on('data', row => {
                if (check) {
                    myrow = JSON.stringify(row);
                    if (myrow.includes("RESULTS FOR ALL NON-WEB LANGUAGE FILES")) {
                        check = false;
                        result.push({ '0': 'RESULTS FOR ALL NON-WEB LANGUAGE FILES' });
                    }
                }
                else result.push(row);
            })
            .on('end', () => {
                check = true;
                fs.createReadStream(`../data/result/${username}/${name}/outfile_summary.csv`)
                    .pipe(csv())
                    .on('data', row => {
                        if (check) {
                            myrow = JSON.stringify(row);
                            if (myrow.includes('"0":"Language"')) {
                                check = false;
                                result.push({ '0': 'KLOC SUMMARY RESULTS' });
                                result.push(row);
                            }
                        }
                        else result.push(row);
                    })
                    .on('end', () => {
                        console.log('Success');
                        res.status(200).json(result);
                    })
            });
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Error" });
    };
};

exports.CompareMac = async (req, res) => {
    request = req.body;
    username = request.username;
    name1 = request.project1;
    name2 = request.project2;

    console.log("UCC Compare: ", username, name1, name2);
    try {
        const { stdout, stderr } = await exec(`./UCC/UCC.mac -unified -d -dir ../data/${username}/${name1} ../data/${username}/${name2} -outdir ../data/result/compare/${username}/${name1}_${name2}/`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/result/compare/${username}/${name1}_${name2}/outfile_diff_results.csv`)
            .pipe(csv())
            .on('data', row => {
                result.push(row);
            })
            .on('end', () => {
                console.log('Success');
                res.json(result);
            });
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Error" });
    };
}

exports.CompareLinux = async (req, res) => {
    request = req.body;
    username = request.username;
    name1 = request.project1;
    name2 = request.project2;

    await console.log("UCC Compare: ", username, name1, name2);

    try {
        const { stdout, stderr } = await exec(`./UCC/UCC.linux -unified -d -dir ../data/${username}/${name1} ../data/${username}/${name2} -outdir ../data/result/compare/${username}/${name1}_${name2}/`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/result/compare/${username}/${name1}_${name2}/outfile_diff_results.csv`)
            .pipe(csv())
            .on('data', row => {
                result.push(row);
            })
            .on('end', () => {
                console.log('Success');
                res.json(result);
            });
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Error" });
    };
}