/* Handle Incoming HTTP Requests */

const exampleFunc = (req, res) => {
    res.json({ message: 'Example'})
}

const anotherExampleFunc = (req, res) => {
    res.json({message: 'Another example'})
}

module.exports = {
    exampleFunc, anotherExampleFunc,
}