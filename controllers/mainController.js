var datum = {
    'momentum': 102.02,
    'rf': 9681.41531,
    'xg': 9341.043,
    'rnnmae': 0.0873,
    'rnn': 9292.100,
    'last': 'May 2 05:00'
}

function update(req, res, next) {
    datum = req.body 

    console.log(datum)

    return res.status(200).json({ message: 'goud' })
}

function pass(req, res, next) {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(datum))
}

module.exports = {
    update,
    pass
}
