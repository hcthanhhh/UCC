exports.CalculateUCP = (req, res) => {
    request = req.body;
    console.log(request);

    try {
        //Unadjusted Use Case Weight    
        let UUCW = (request.UUCW[0] * 5) + (request.UUCW[1] * 10) + (request.UUCW[2] * 15);


        //Unadjusted Actor Weight
        let UAW = request.UAW[0] + (request.UAW[1] * 2) + (request.UAW[2] * 3);


        //Technical Complpexity Factor
        let TCF = 0.6;
        let TF = 0; //Technical Factor


        for (let i = 0; i < 13; i++) {
            TF = request.TCF.weight[i] * request.TCF.assigned_value[i];
        }
        TCF += (TF / 100);


        //Environmental Complexity Factor
        let ECF = 1.4;
        let EF = 0 //Environmental Factor

        for (let i = 0; i < 8; i++) {
            EF = request.ECF.weight[i] * request.ECF.assigned_value[i];
        }
        ECF += (-0.03 * EF);


        //Use Case Point
        let UCP = (UUCW + UAW) * TCF * ECF;


        res.status(200).send({
            'UUCW': UUCW,
            'UAW': UAW,
            'TCF': TCF,
            'ECF': ECF,
            'UCP': UCP
        });
    } catch (error) {
        res.status(403).send({ message: error });
    }
}