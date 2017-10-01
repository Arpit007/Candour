/**
 * Created by Home Laptop on 01-Oct-17.
 */
let defaults = require('./configRelease.json');

let dB = {
    name: defaults['dbConfig']['name'],
    config: defaults['dbConfig'][defaults['dbConfig']['name']]
};

delete defaults['dbConfig'];

defaults['dB'] = dB;
defaults['dB']['config']['url'] = process.env[defaults['dB']['config']['env']] || defaults['dB']['config']['url'] ;
defaults['port'] = process.env['PORT'] || defaults['port'] ;


module.exports = defaults;