exports.BasicCocomo = (req, res) => {
    let request = req.body;
    let size = request.size;
    let check = 0;

    let model = ['Organic', 'Semi-Detached', 'Embedded'];

    let table = [2.4, 1.05, 2.5, 0.38, 3.0, 1.12, 2.5, 0.35, 3.6, 1.20, 2.5, 0.32];

    // Organic
    if (size >= 2 && size <= 50)
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