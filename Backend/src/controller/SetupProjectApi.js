const util = require('util');
const download = require('download-git-repo');
const exec = util.promisify(require('child_process').exec);

exports.CloneProject = (req, res) => {
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
            exec(`mkdir -p ../data/${username}/result/${name}`);
            console.log('Success');
        }
    });
}

exports.UploadProject = async (req, res) => {
    request = req.body;
    file = req.file;
    var username = request.username;
    var name = request.name;

    console.log("Upload Project: ", file.originalname, username, name);

    try {
        await exec(`mkdir -p ../data/${username}/${name}`);
        await exec(`mv ../data/${file.filename} ../data/${file.originalname}`);
        await exec(`unzip ../data/${file.originalname} -d ../data/${username}/${name}`);
        await exec(`rm ../data/${file.originalname}`);
        await exec(`mkdir -p ../data/${username}/result/${name}`);
        res.status(200).send({ message: 'Success' });
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
        exec(`rm -rf ../data/${username}/${name}`);
        exec(`rm -rf ../data/${username}/result/${name}`);
        res.status(200).send({ message: "Success" });
        console.log('Success');
    } catch (error) {
        console.log(error);
        res.status(404).send({ message: "Error" });
    };
}

exports.UpdateProject = (req, res) => {

}