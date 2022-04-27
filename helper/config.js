let environment = {
    development: {
        "host": "localhost",
        "user": "vimlesh",
        "password": "vimlesh@123",
        "database": "test",
        "port": 3000,
        "clientExpire": 60 * 60 * 24 * 365
    },
    uat: {
    },
}

exports.get = function (env) {
    try {
        return environment[env];
    } catch (err) {
        console.log(err);
    }
};
