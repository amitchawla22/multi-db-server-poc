var connections = require('./config.json').connections;
var Sequelize = require('sequelize');
var Promise = require('bluebird');
var _models = {};

module.exports = {
    initialize: initialize,
    models: getModel
}

function initialize() {
    Object.keys(connections).forEach((_client) => {
        let _connection = connections[_client];
        let _database = createDBConnection(_connection);
        intializeModels(_database, _client);
    });
}

function createDBConnection(_connection) {
    return new Sequelize(_connection.database, _connection.username, _connection.password, {
        host: _connection.host,
        dialect: 'postgres',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });
}

function intializeModels(_database, _client) {
    _database.authenticate()
    .then(() => {
        console.log('Connection has been established successfully with database ' + _client);
        createDBModels(_database, _client)
            .then(() => console.log("customer model verified, it exists for ", _client));
    })
    .catch((err) => {
        console.error('Unable to connect to the database ' + _client, err);
    });
}

// This is just an poc version but we can make it generic to import all models through some pattern
function createDBModels(_database, _client) {
    return new Promise((resolve, reject) => {
        var _customer = _database.import('./models/Customer.js');
        _customer.sync()
        .then(() => {
            if(!_models.hasOwnProperty(_client)) {
                _models[_client] = {};
            }
            _models[_client]['customer'] = _customer;
            resolve();
        });
    });
}

function getModel(_client, _name) {
    return _models[_client][_name];
}