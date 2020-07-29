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

function isUndefined(value) {
    // Obtain `undefined` value that's
    // guaranteed to not have been re-assigned
    var undefined = void (0);
    return value === undefined;
}

exports.BasicCocomo = async (req, res) => {
    let request = req.body;
    username = request.username;
    name = request.name;
    mode = request.mode;

    console.log('Basic Cocomo: ', username, name);

    let size = 0;
    if (isUndefined(request.size)) size = await getsize(username, name);
    else size = request.size;
    size = size / 1000;

    let model = {
        '0': [2.4, 1.05, 2.5, 0.38],
        '1': [3.0, 1.12, 2.5, 0.35],
        '2': [3.6, 1.20, 2.5, 0.32]
    };

    effort = model[mode][0] * Math.pow(size, model[mode][1]);
    EstimateTime = model[mode][2] * Math.pow(effort, model[mode][3]);
    staff = Math.round(effort / EstimateTime) > 1 ? Math.round(effort / EstimateTime) : 1;

    res.status(200).json({
        'effort': effort,
        'time': EstimateTime,
        'staff': staff
    });
}

exports.IntermediateCocomo = async (req, res) => {
    let request = req.body;
    username = request.username;
    name = request.name;
    drivers = request.drivers;
    mode = request.mode;

    console.log('Intermediate Cocomo: ', username, name);

    attributes = {
        '0': [0.75, 0.88, 1, 1.15, 1.4],
        '1': [1, 1, 1, 1.08, 1.16],
        '2': [0.7, 0.85, 1, 1.15, 1.3],
        '3': [1, 1, 1, 1.11, 1.3],
        '4': [1, 1, 1, 1.06, 1.21],
        '5': [1, 0.87, 1, 1.15, 1.3],
        '6': [1, 0.94, 1, 1.07, 1.15],
        '7': [1.46, 1.19, 1, 0.86, 0.71],
        '8': [1.29, 1.13, 1, 0.91, 0.82],
        '9': [1.42, 1.17, 1, 0.86, 0.7],
        '10': [1.21, 1.1, 1, 0.9, 1],
        '11': [1.14, 1.07, 1, 0.95, 1],
        '12': [1.24, 1.1, 1, 0.91, 0.82],
        '13': [1.24, 1.1, 1, 0.91, 0.83],
        '14': [1.23, 1.08, 1, 1.04, 1.1]
    }

    driver = 1;
    i = 0;
    drivers.forEach(element => driver *= attributes[i][element]);

    let size = 0;
    if (isUndefined(request.size)) size = await getsize(username, name);
    else size = request.size;
    size = size / 1000;

    let model = {
        '0': [2.4, 1.05, 2.5, 0.38],
        '1': [3.0, 1.12, 2.5, 0.35],
        '2': [3.6, 1.20, 2.5, 0.32]
    };

    effort = model[mode][0] * Math.pow(size, model[mode][1]) * driver;
    EstimateTime = model[mode][2] * Math.pow(effort, model[mode][3]);
    staff = Math.round(effort / EstimateTime) > 1 ? Math.round(effort / EstimateTime) : 1;

    res.status(200).json({
        'effort': effort,
        'time': EstimateTime,
        'staff': staff
    });
}

exports.DetailedCocomo = (req, res) => { }