module.exports = {
    "appName" : "Candour: Debug",
    "port" : 3000,
    "dbConfig" : {
        "url" : "mongodb://localhost:27017",
        "db" : "Candour"
    },
    "crypto" : {
        "SessionKey" : "Hello World!"
    },
    "auth" : {
        "expiry" : 365 * 24 * 60 * 60 * 1000
    }
};