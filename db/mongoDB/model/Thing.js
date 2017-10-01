/**
 * Created by Home Laptop on 01-Oct-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThingSchema = new Schema({
    name:  String,
    info:  String,
    active: Boolean
});

module.exports = mongoose.model('Thing', ThingSchema);

