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

module.exports = {
    update,
    pass
}