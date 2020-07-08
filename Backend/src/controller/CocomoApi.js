const fs = require('fs');
const csv = require('csv-parser');

function getsize(username, name) {
    return new Promise((resolve, reject) => {
        result = 0;
        fs.createReadStream(`../data/result/${username}/${name}/outfile_summary.csv`)
            .pipe(csv())
            .on('error', (err) => reject(err))
            .on('data', row => {
                if (row['0'] == 'Total');
                result = parseInt(row['3']);
            })
            .on('end', () => resolve(result));
    })
}

exports.BasicCocomo = async (req, res) => {
    let request = req.body;
    let size = 0;
    let check = 0;

    size = await getsize(request.username, request.name);
    size = size / 1000;
    console.log(size);

    let model = ['Organic', 'Semi-Detached', 'Embedded'];

    let table = [2.4, 1.05, 2.5, 0.38, 3.0, 1.12, 2.5, 0.35, 3.6, 1.20, 2.5, 0.32];

    // Organic
    if (size <= 50)
        check = 0;

    // Semi-detached
    else if (size > 50 && size <= 300)
        check = 1;

    // Embedded 
    else if (size > 300)
        check = 2;

    // Size < 2
    else {
        res.status(403).send({ message: 'Error' });
        return;
    }

    let effort = table[0 + 4 * check] * Math.pow(size, table[1 + 4 * check]);
    let time = table[2 + 4 * check] * Math.pow(effort, table[3 + 4 * check]);
    let staff = Math.round(effort / time);
    if (staff == 0) staff = 1;
    res.status(200).send({
        model: model[check],
        effort: effort,
        time: time,
        staff: staff
    });
}

exports.IntermediateCocomo = (req, res) => {

}

exports.DetailedCocomo = (req, res) => { }