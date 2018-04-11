/**
 * Created by StarkX on 08-Mar-18.
 */
const mongoose = require('mongoose');
const bCrypt = require('bcrypt');
const UserSchema = require('../schema/userSchema');

UserSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password') || this.isNew) {
        return bCrypt.genSalt(8)
            .then((salt) => bCrypt.hash(user.password, salt))
            .then((hash) => {
                user.password = hash
            })
            .catch((err) => console.log(err))
            .then(() => next());
    }
    else return next();
});

UserSchema.methods.comparePassword = (password) => {
    return bCrypt.compare(this.local.password, password);
};

UserSchema.statics.getUser = (emailOrHandle, password) => {
    return UserModel
        .findOne({ $or : [ { email : emailOrHandle }, { handle : emailOrHandle } ] })
        .then((user) => {
            return user.comparePassword(password)
                .then((isValid) => {
                    if (isValid) return user;
                });
        }).catch((err) => {
            if (xConfig.debugMode)
                console.log("getUser - Err: ", err)
        });
};

module.exports = UserModel = mongoose.model('User', UserSchema);