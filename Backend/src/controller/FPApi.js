function isUndefined(value) {
    // Obtain `undefined` value that's
    // guaranteed to not have been re-assigned
    var undefined = void (0);
    return value === undefined;
}

exports.CalculateFP = (req, res) => {
    request = req.body;
    console.log(request);

    try {
        attribute = {
            '0': [3, 4, 6],
            '1': [4, 5, 7],
            '2': [3, 4, 6],
            '3': [7, 10, 15],
            '4': [5, 7, 10],
        }
        // Complexity Adjustment Factor
        let CAF = 0;

        request.CAF.forEach(element => {
            CAF += element
        });

        CAF = 0.65 + (0.01 * CAF);


        // Unadjusted Function Points
        let UFP = 0;
        frates = request.frates;

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 3; j++) {
                UFP += frates[i][j] * wtFactors[i][j];
            }
        }

        // Function Point
        let FP = 0;
        FP = UFP * CAF;

        //PF
        let PF = 0;
        if (isUndefined(request.FP)) PF = 0.083;
        else {
            nPF = request.PF.n;
            for (let i = 0; i < nPF; i++) {
                PF += request.PF.value[i];
            }
            PF = PF / (nPF * 8 * 30);
        }

        let Effort = FP * PF;
        let EstimateTime = 3.0 * Effort ** 1 / 3;
        let Staff = Effort / EstimateTime > 1 ? Math.round(Effort / EstimateTime) : 1;

        res.status(200).send({
            'UFP': UFP,
            'CAF': CAF,
            'FP': FP,
            'PF': PF,
            'Time': Math.round(EstimateTime),
            'Staff': Staff
        });
    } catch (error) {
        res.status(403).send({ message: error });
    }
}