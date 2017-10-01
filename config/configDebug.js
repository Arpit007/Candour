/**
 * Created by Home Laptop on 01-Oct-17.
 */
let defaults = require('./configDebug.json');

let dB = {
    name: defaults['dbConfig']['name'],
    config: defaults['dbConfig'][defaults['dbConfig']['name']]
};

delete defaults['dbConfig'];

defaults['dB'] = dB;

module.exports = defaults;