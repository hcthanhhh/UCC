const util = require('util');
const download = require('download-git-repo');
const exec = util.promisify(require('child_process').exec);
const { getProjectSize } = require('./GetInfoApi');
const axios = require('axios');

exports.CloneProject = async (req, res) => {
    request = req.body;
    let repo = request.url;
    let username = request.username;
    let name = request.name;

    console.log("CLone GIT: ", repo, username, name);

    let user_repo = repo;
    if (repo.includes("https://")) user_repo = repo.substring(19, repo.length);
    else user_repo = repo.substring(11, repo.length);

    console.log(user_repo);

    let size = 0;
    let private = false;
    await axios.get(`https://api.github.com/repos/${user_repo}`)
        .then((res) => {
            console.log(res);
            size = res.data.size;
            private = res.data.private;
        });

    console.log(size);
    if (size > 100000) {
        res.status(404).send({ size: size * 1000 })
        return;
    }
    if (private) {
        res.status(404).send({ message: 'Private' })
        return;
    }

    exec(`mkdir -p ../data/result/${username}/${name}`);
    download(`direct:${repo}`, `../data/${username}/${name}`, { clone: true }, async (e) => {
        if (e) {
            exec(`rm -rf ../data/result/${username}/${name}`);
            res.status(404).send({ message: 'Error' })
            console.log('Error: ', e);
        }
        else {
            await res.status(200).send({ size: size * 1000 });
            // await getProjectSize(req, res);
            console.log('Success');
        }
    });
}

exports.UploadProject = async (req, res) => {
    request = req.body;
    file = req.file;
    let username = request.username;
    let name = request.name;

    console.log("Upload Project: ", file.originalname, username, name);

    try {
        await exec(`mkdir -p '../data/${username}/${name}'`);
        await exec(`mv '../data/${file.filename}' '../data/${file.originalname}'`);
        await exec(`unzip '../data/${file.originalname}' -d '../data/${username}/${name}'`);
        await exec(`rm '../data/${file.originalname}'`);
        await exec(`mkdir -p '../data/result/${username}/${name}'`);
        // res.status(200).send({ message: 'Success' });
        getProjectSize(req, res);
    } catch (error) {
        console.log("Error: ", error);
        res.status(404).send({ message: 'Error' });
    }
}

exports.DeleteProject = (req, res) => {
    request = req.body;
    username = request.username;
    name = request.name;

    console.log("Delete GIT: ", username, name);

    try {
        exec(`rm -rf '../data/${username}/${name}'`);
        exec(`rm -rf '../data/result/${username}/${name}'`);
        res.status(200).send({ message: "Success" });
        console.log('Success');
    } catch (error) {
        console.log(error);
        res.status(404).send({ message: "Error" });
    };
}

exports.UpdateProject = (req, res) => {

}