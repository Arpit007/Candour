/**
 * Created by StarkX on 08-Mar-18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let mongooseHidden = require('mongoose-hidden')();
let langList = [ 'en-us' ];

const UserSchema = new Schema({
    handle : { type : String, trim : true, required : true },
    email : { type : String, trim : true, required : true, unique : true, sparse : true, lowercase : true },
    password : { type : String, required : true, hideJSON : true },
    role : { type : String, enum : [ 'user', 'admin' ], default : 'user', hideJSON : true },
    profile : {
        name : { type : String, trim : true, required : true },
        lang : { type : String, default : 'en-us', enum : langList },
    }
});

UserSchema.plugin(mongooseHidden);

module.exports = UserSchema;