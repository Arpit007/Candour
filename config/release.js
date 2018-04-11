module.exports = {
    "appName" : "Candour: Release",
    "port" : 80,
    "dbConfig" : {
        "url" : "mongodb://localhost:27017",
        "db" : "Candour"
    },
    "crypto" : {
        "SessionKey" : "Hello World!"
    },
    "auth" : {
        "expiry" : 365 * 24 * 60 * 60 * 1000,
        "accessTokenLifetime" : 60 * 60, //1 hour
        "refreshTokenLifetime" : 60 * 60 * 24 * 7 * 2, //2 weeks
        "authorizationCodeLifetime" : 5 * 60 //5 minutes
    }
};