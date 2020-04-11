const download = require('download-git-repo');
const shell = require('node-powershell');
const csv = require('csv-parser');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

exports.UploadProject = async (req, res) => {
    request = req.body;
    file = req.file;
    console.log(request);
    var username = request.username;
    var name = request.name;
    try {
        await exec(`mkdir ../data/${username}/${name}`);
        await exec(`mv ../data/${file.filename} ../data/${file.originalname}`);
        await exec(`unzip ../data/${file.originalname} -d ../data/${username}/${name}`);
        await exec(`rm ../data/${file.originalname}`);
        res.status(200).send({message: 'Success'});
    } catch (error) {
        console.log("Error: ", error);
        res.status(404).send(error);
    }
}

exports.CloneGit = (req, res) => {
    request = req.body;
    console.log(req);
    var repo = request.url;
    var username = request.username;
    var name = request.name;
    download(`direct:${repo}`, `../data/${username}/${name}`, { clone: true }, (e) => {
        if (e) {
            res.status(404).send({ message: 'Error' })
            console.log('Error');
        }
        else {
            res.status(200).send({message: 'Success'});
            console.log('Success');
        }
    });
}
exports.UCCaUrl = async (req, res) => {
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

exports.UCC2Url = async (req, res) => {

    request = req.body;
    console.log(request);
    username = req.body.username;
    name = req.body.name;

    try {
        const { stdout, stderr } = await exec(`./UCC/UCC -unified -dir ../data/${username}/${name} -outdir ../data/${username}/result/${name}`);
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        var result = []
        fs.createReadStream(`../data/${username}/result/${name}/TOTAL_outfile.csv`)
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
exports.DeleteGit = () => {

}
exports.UpdateGit = () => {

}