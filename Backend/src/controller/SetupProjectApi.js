const util = require('util');
const download = require('download-git-repo');
const exec = util.promisify(require('child_process').exec);
const { getProjectSize } = require('./GetInfoApi');
const axios = require('axios');

function GetUser_Repo(repo) {
    if (repo.includes("https://github.com/")) return repo.substring(19, repo.length);
    if (repo.includes("https://www.github.com/")) return repo.substring(23, repo.length);
    if (repo.includes("github.com/")) return repo.substring(11, repo.length);
    if (repo.includes("www.github.com/")) return repo.substring(14, repo.length);
    return 'gg';
}

exports.CloneProject = async (req, res) => {
    request = req.body;
    let repo = request.url;
    let username = request.username;
    let name = request.name;

    console.log("CLone GIT: ", repo, username, name);

    let user_repo = await GetUser_Repo(repo);
    console.log(user_repo);
    if (user_repo == "gg") {
        res.status(404).send({ message: "Incorrect User/Repo" })
        return;
    }

    let size = 0;
    let private = false;
    await axios.get(`https://api.github.com/repos/${user_repo}`)
        .then((res) => {
            size = res.data.size;
            private = res.data.private;
        })
        .catch((err) => {
            private = true;
        })

    console.log(size);
    if (private) {
        res.status(404).send({ message: 'Private' })
        return;
    }
    if (size > 100000) {
        res.status(404).send({ size: size * 1000 })
        return;
    }
    exec(`mkdir -p ../data/result/${username}/${name}`);
    exec(`mkdir -p ../data/compressed/${username}`);

    download(`direct:${repo}`, `../data/${username}/${name}`, { clone: true }, async (e) => {
        if (e) {
            let err = e.toString();
            console.log(err);
            if (err.includes("Error: 'git checkout' failed with status 1")) {
                await res.status(200).send({ size: size * 1000 });
                await exec(`zip -r ../data/compressed/${username}/${name}.zip ../data/${username}/${name}/`);
                console.log('Success');
            }
            else if (err.includes("Error: 'git clone' failed with status 128")) {
                await res.status(404).send({ message: "This project is already cloned. You need to delete this or create a new project." });
                console.log(e);
            }
            else {
                exec(`rm -rf ../data/result/${username}/${name}`);
                res.status(404).send({ message: 'Error' })
                console.log(e);
            }
        }
        else {
            await res.status(200).send({ size: size * 1000 });
            // await getProjectSize(req, res);
            await exec(`zip -r ../data/compressed/${username}/${name}.zip ../data/${username}/${name}/`);
            console.log('Success');
        }
    });
}

exports.UploadProject = async (req, res) => {
    request = req.body;
    let file = req.file;
    let username = request.username;
    let name = request.name;

    console.log("Upload Project: ", file.originalname, username, name);

    try {
        await exec(`mkdir -p '../data/${username}/${name}'`);
        await exec(`unzip '../data/${file.filename}' -d '../data/${username}/${name}'`);
        await exec(`mkdir -p '../data/result/${username}/${name}'`);
        await exec(`mkdir -p ../data/compressed/${username}`);
        await exec(`mv '../data/${file.filename}' '../data/compressed/${username}/${name}.zip'`);
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