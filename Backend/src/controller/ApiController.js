const download = require('download-git-repo');
const shell = require('node-powershell');
const csv = require('csv-parser');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

exports.UploadProject = async (req, res) => {
    request = req.body;
    file = req.file;
    var username = request.username;
    var name = request.name;

    console.log("CLone GIT: ", file.originalname, username, name);

    try {
        await exec(`mkdir -p ../data/${username}/${name}`);
        await exec(`mv ../data/${file.filename} ../data/${file.originalname}`);
        await exec(`unzip ../data/${file.originalname} -d ../data/${username}/${name}`);
        await exec(`rm ../data/${file.originalname}`);
        res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.log("Error: ", error);
        res.status(404).send({ message: 'Error' });
    }
}

exports.CloneGit = (req, res) => {
    request = req.body;
    var repo = request.url;
    var username = request.username;
    var name = request.name;

    console.log("CLone GIT: ", repo, username, name);

    download(`direct:${repo}`, `../data/${username}/${name}`, { clone: true }, async (e) => {
        if (e) {
            res.status(404).send({ message: 'Error' })
            console.log('Error: ', e);
        }
        else {
            await res.status(200).send({ message: 'Success' });
            // const {stdout, stderr} = await exec (`find ../data/${username}/${name} -type f > ..data/${username}/${name}/listFiles.txt`);
            // const { stdout, stderr } = await exec(`ls -r ../data/${username}/${name}`);
            // console.log(stdout);
            console.log('Success');
        }
    });

}

exports.DeleteGit = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log("Delete GIT: ", username, name);

    try {
        exec(`rm -rf ../data/${username}/${name}`);
        exec(`rm -rf ../data/${username}/result/${name}`);
        res.status(200).send({ message: "Success" });
        console.log('Success');
    } catch (error) {
        console.log(error);
        res.status(404).send({ message: "Error" });
    };
}

exports.GetInfo = (req, res) => {
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
        await exec(`tail ../data/${username}/${name}/fileList.txt > ../data/${username}/result/${name}/fileList.txt`);
        res.set('Content-Type', 'text/plain');
        res.status(200).sendFile(path.resolve(`../data/${username}/result/${name}/fileList.txt`));
        console.log('Success');
    } catch (err) {
        console.log("Error: ", err);
        res.send(404).send({ message: 'Error' });
    }
}

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

    await ps.addCommand(`./UCC/UCC -unified -dir ../data/${username}/${name} -outdir ../data/${username}/result/${name}`);
    await ps.invoke().then(output => console.log(`res: ${output}`));

    var result = []
    fs.createReadStream(`../data/${username}/result/${name}/TOTAL_outfile.csv`)
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
            res.status(200).json(result);
        });
}

exports.UCCUrlMac = async (req, res) => {

    request = req.body;
    console.log(request);
    username = req.body.username;
    name = req.body.name;
    check = true;

    console.log("Run UCC: ", username, name);

    try {
        const { stdout, stderr } = await exec(`./UCC/UCC.mac -unified -dir ../data/${username}/${name} -outdir ../data/${username}/result/${name}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/${username}/result/${name}/TOTAL_outfile.csv`)
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
                res.status(200).json(result);
            });
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Error" });
    };
}

exports.UCCUrlLinux = async (req, res) => {

    request = req.body;
    username = req.body.username;
    name = req.body.name;
    check = true;

    console.log("Run UCC: ", username, name);
    check = true;

    try {
        const { stdout, stderr } = await exec(`./UCC/UCC.linux -unified -dir ../data/${username}/${name} -outdir ../data/${username}/result/${name}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/${username}/result/${name}/TOTAL_outfile.csv`)
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
                res.status(200).json(result);
                console.log('Success');
            });
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Error" });
    };
}

exports.UpdateGit = () => {

}

exports.Compare = async (req, res) => {
    request = req.body;
    username = request.username;
    name1 = request.project1;
    name2 = request.project2;

    console.log("UCC Compare: ", username, name1, name2);
    try {
        const { stdout, stderr } = await exec(`./UCC/UCC.mac -unified -d -dir ../data/${username}/${name1} ../data/${username}/${name2} -outdir ../data/${username}/result/compare/${name1}_${name2}/`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/${username}/result/compare/${name1}_${name2}/outfile_diff_results.csv`)
            .pipe(csv())
            .on('data', row => {
                result.push(row);
            })
            .on('end', () => {
                console.log('success');
                res.json(result);
            });
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Error" });
    };
}

exports.Hello = (req, res) => {
    res.status(200).send({ message: 'Hello World' });
}