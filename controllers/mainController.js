var datum = {'text': ''}

function update(req, res, next) {
    // const time = req.body.timeActivation
    // const value = req.body.currentValue
    datum.text = req.body.text

    // console.log(value)
    return res.status(200).json({ message: 'goud' })
}

function pass(req, res, next) {
    if ( datum == '' ) {
        return res.status(200).json({ message: 'SERVER DOWN' })
    } else {
        return res.status(200).json({ message: datum })
    }
}

// function test(req, res, next) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify({ a: 1, b: 2, c: 3 }));
// }

module.exports = {
    update,
    pass
}