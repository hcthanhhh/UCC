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
    console.log(request);
    var username = request.username;
    var name = request.name;
    try {
        await exec(`mkdir -p ../data/${username}/${name}`);
        await exec(`mv ../data/${file.filename} ../data/${file.originalname}`);
        await exec(`unzip ../data/${file.originalname} -d ../data/${username}/${name}`);
        await exec(`rm ../data/${file.originalname}`);
        res.status(200).send({message: 'Success'});
    } catch (error) {
        console.log("Error: ", error);
        res.status(404).send({message: 'Error'});
    }
}

exports.CloneGit = (req, res) => {
    request = req.body;
    console.log(request);
    var repo = request.url;
    var username = request.username;
    var name = request.name;

    console.log("CLone GIT: ",repo, username, name);
    
    download(`direct:${repo}`, `../data/${username}/${name}`, { clone: true }, async (e) => {
        if (e) {
            res.status(404).send({ message: 'Error' })
            console.log('Error');
            console.log(e);
        }
        else {
            await res.status(200).send({message: 'Success'});
            // const {stdout, stderr} = await exec (`find ../data/${username}/${name} -type f > ..data/${username}/${name}/listFiles.txt`);
            const {stdout, stderr} = await exec(`ls -r ../data/${username}/${name}`);
            console.log(stdout);
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
        res.status(200).send({message: "Success"});
    } catch (error) {
        console.log(error);
        res.status(404).send({message: "Error"});
    };
}

exports.GetInfo = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log("Get README.md: ", username, name);

    fs.readdir(`../data/${username}/${name}`, (err, files) => {
        if (err) {
            console.log(err);
            res.status(404).send({message: "Error"});
            return;
        }
        console.log(files);
        if (files.length == 1) {
            fs.readdir(`../data/${username}/${name}`, (err, files) => {
                if (err) {
                    console.log(err);
                    res.status(404).send({message: "Error"});
                    return;
                }
                if (files.includes('README.md')) {
                    res.set('Content-Type','text/plain');
                    res.status(200).sendFile(path.resolve(`../data/${username}/${name}/README.md`));
                }
                else {
                    console.log("hihi");
                    res.status(403).send(files);
                }
                return;
            })
        } 
        else if (files.includes('README.md')) {
            res.set('Content-Type','text/plain');
            res.status(200).sendFile(path.resolve(`../data/${username}/${name}/README.md`));
        }
        else {
            console.log("haha");
            res.status(403).send(files);
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
        exec(`find ../data/${username}/${name} > ../data/${username}/${name}/fileList.txt`);
        res.set('Content-Type','text/plain');
        res.status(200).sendFile(path.resolve(`../data/${username}/${name}/fileList.txt`));
    } catch (err) {
        console.log(err);
        res.send(404).send({message: 'Error'});
    }
}
 
exports.UCCUrlWindows = async (req, res) => {
    request = req.body;
    console.log(request);
    username = req.body.username;
    name = req.body.name;

    let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });

    await ps.addCommand(`./UCC/UCC -unified -dir ../data/${username}/${name} -outdir ../data/${username}/${name}/result`);
    await ps.invoke().then(output => console.log(`res: ${output}`));

    var result = []
    fs.createReadStream(`../data/${username}/${name}/result/TOTAL_outfile.csv`)
        .pipe(csv())
        .on('data', row => {
            result.push(row);
        })
        .on('end', () => {
            res.json(result);
        });
}

exports.UCCUrlMac = async (req, res) => {

    request = req.body;
    console.log(request);
    username = req.body.username;
    name = req.body.name;

    console.log("Run UCC: ", username, name);

    try {
        const { stdout, stderr } = await exec(`./UCC/UCC.mac -unified -dir ../data/${username}/${name} -outdir ../data/${username}/result/${name}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/${username}/result/${name}/TOTAL_outfile.csv`)
            .pipe(csv())
            .on('data', row => {
                result.push(row);
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
    console.log(request);
    username = req.body.username;
    name = req.body.name;

    console.log("Run UCC: ", username, name);

    try {
        const { stdout, stderr } = await exec(`./UCC/UCC.linux -unified -dir ../data/${username}/${name} -outdir ../data/${username}/result/${name}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/${username}/result/${name}/TOTAL_outfile.csv`)
            .pipe(csv())
            .on('data', row => {
                result.push(row);
            })
            .on('end', () => {
                res.status(200).json(result);
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
                res.json(result);
            });
    } catch (error) {
        console.error(error);
        res.status(404).send({ message: "Error" });
    };
}

exports.Hello = (req, res) => {
    res.status(200).send({message: 'Hello World'});
}