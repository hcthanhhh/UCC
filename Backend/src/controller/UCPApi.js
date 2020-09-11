function isUndefined(value) {
    // Obtain `undefined` value that's
    // guaranteed to not have been re-assigned
    var undefined = void (0);
    return value === undefined;
}

exports.CalculateUCP = (req, res) => {
    request = req.body;
    console.log(request);

    try {
        //Unadjusted Use Case Weight    
        let UUCW = (request.UUCW[0] * 5) + (request.UUCW[1] * 10) + (request.UUCW[2] * 15);


        //Unadjusted Actor Weight
        let UAW = request.UAW[0] + (request.UAW[1] * 2) + (request.UAW[2] * 3);


        //Technical Complpexity Factor
        let nTCF = request.TCF.n;
        let TCF = 0.6;
        let TF = 0; //Technical Factor


        for (let i = 0; i < nTCF; i++) {
            TF = request.TCF.weight[i] * request.TCF.assigned_value[i];
        }
        TCF += (TF / 100);


        //Environmental Complexity Factor
        let nECF = request.ECF.n;
        let ECF = 1.4;
        let EF = 0 //Environmental Factor

        for (let i = 0; i < nECF; i++) {
            EF = request.ECF.weight[i] * request.ECF.assigned_value[i];
        }
        ECF += (-0.03 * EF);


        //Use Case Point
        let UCP = (UUCW + UAW) * TCF * ECF;

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

        let Effort = PF * UCP;
        let EstimateTime = 3.0 * Effort ** 1 / 3;
        let Staff = Effort / EstimateTime > 1 ? Math.round(Effort / EstimateTime) : 1;

        res.status(200).send({
            'UCP': UCP,
            'Effort': Effort,
            'PF': PF,
            'Time': Math.round(EstimateTime),
            'Staff': Staff
        });
    } catch (error) {
        res.status(403).send({ message: error });
    }
}