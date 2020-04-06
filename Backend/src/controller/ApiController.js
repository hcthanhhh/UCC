const download = require('download-git-repo');
const shell = require('node-powershell');
const csv = require('csv-parser');
const fs = require('fs');

exports.CloneGit = (req, res) => {
    request = req.body;
    console.log(request);
    var repo = request.url;
    var username = request.username;
    var name = request.name;
    download(`direct:${repo}`, `../data/${username}/${name}`, { clone: true }, (e) => {
        console.log(e);
    });
    res.status(200).send('Success');
    // console.log('success');
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

    // ps.addCommand('cd ../../');
    await ps.addCommand(`./UCC/UCC -unified -dir ../data/${username}/${name} -outdir ../data/${username}/${name}/result`);
    await ps.invoke().then(output => console.log(`res: ${output}`));

    var result = []
    // res.attachment(`./data/${username}/${name}/result/TOTAL_outfile.csv`);
    fs.createReadStream(`../data/${username}/${name}/result/TOTAL_outfile.csv`)
        .pipe(csv())
        .on('data', row => {
            result.push(row);
        })
        .on('end', () => {
            console.log('CSV file');
            console.log(result);
            res.write(JSON.stringify(result));
    });
}

exports.UCC2Url = () => {
    
}
exports.DeleteGit = () => {

}
exports.UpdateGit = () => {

}