/**
 * Created by StarkX on 09-Apr-18.
 */
const model = require('../model/model');
const config = require('../../config/config');

model.AuthScope.find({}).remove()
    .then(() => {
        model.AuthScope.create({
            scope : 'profile',
            is_default : false
        }, {
            scope : 'defaultscope',
            is_default : true
        }).then(() => console.log('finished populating OAuthScope'));
    });

model.User.find({}).remove()
    .then(() => {
        model.User.create({
            handle : 'Arpit007',
            email : 'arpit2011@live.com',
            password : 'helloworld',
            profile : {
                name : 'Arpit Bhatnagar'
            }
        }).then((user) => {
            console.log('finished populating users');
            return model.AuthClient.find({}).remove()
                .then(() => {
                    model.AuthClient.create({
                        name : 'Sample Client',
                        clientId : 'democlient',
                        clientSecret : 'democlientsecret',
                        redirectUri : 'http://localhost/cb'
                    }).then(() => console.log('finished populating OAuthClient'))
                        .catch(console.log);
                });
        });
    });