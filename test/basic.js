var test = require('tape');

var config = require('../');

test('basic', function(t) {
    // set up the environment
    process.env.COLUMNS = 104;
    process.env.SHELL = '/bin/bash';
    delete process.env.blah1;
    delete process.env.blah2;
    process.env.HISTSIZE = 1000;

    var cfg = config({
        columns : {
            env      : 'COLUMNS',
            type     : 'integer',
        },
        shell : {
            env      : 'SHELL',
            type     : 'string',
            required : true,
        },
        blah1 : {
            env      : 'BLAH1',
            type     : 'string',
        },
        blah2 : {
            env      : 'BLAH1',
            type     : 'string',
            default  : 'blah2',
            required : true,
        },
        histSize : {
            env      : 'HISTSIZE',
            type     : 'integer',
        },
    });

    t.equal(cfg.columns, 104, 'Columns should be 104');
    t.equal(typeof cfg.columns, 'number', 'Columns should be a number');

    t.equal(cfg.shell, '/bin/bash', 'Shell should be /bin/bash');
    t.equal(typeof cfg.columns, 'number', 'Columns should be a number');

    t.equal(cfg.blah1, undefined, 'Blah1 should be not be defined');

    t.equal(cfg.blah2, 'blah2', 'Blah2 should take the default value');
    t.equal(typeof cfg.blah2, 'string', 'Blah2 should be a string');

    t.equal(cfg.histSize, 1000, 'histSize should be set correctly');    // set up the environment
    process.env.COLUMNS = 104;
    process.env.SHELL = '/bin/bash';
    delete process.env.blah1;
    delete process.env.blah2;
    process.env.HISTSIZE = 1000;

    t.equal(typeof cfg.histSize, 'number', 'histSize should be a number');

    t.end();
});

test('enum, passes ok', function(t) {
    process.env.ENVIRONMENT = 'development';

    var cfg = config({
        environment : {
            env : 'ENVIRONMENT',
            type : 'enum',
            values : [ 'development', 'test', 'stage', 'production' ],
        },
    });

    t.deepEqual(cfg.environment, 'development', 'environment is ok');

    t.end();
});

test('enum, fails due to invalid value', function(t) {
    t.plan(1);

    process.env.ENVIRONMENT = 'invalid';

    try {
        var cfg = config({
            environment : {
                env : 'ENVIRONMENT',
                type : 'enum',
                values : [ 'development', 'test', 'stage', 'production' ],
            },
        });
        t.fail('This config should fail, invalid value for enum')
    }
    catch (err) {
        t.equal(err.message, 'Invalid enum for environment(development, test, stage, production) : invalid', 'Failed with the correct error message');
    }

    t.end();
});

test('enum, no values specified', function(t) {
    t.plan(1);

    try {
        var cfg = config({
            environment : {
                env : 'ENVIRONMENT',
                type : 'enum',
            },
        });
        t.fail('This config should fail, invalid value for enum')
    }
    catch (err) {
        t.equal(err.message, "No values specified for the 'environment' enum", 'Failed with the correct error message');
    }

    t.end();
});

test('boolean, true values', function(t) {
    var trueString = [
        'true', 'True', 'TRUE', 'yes', 'Yes', 'YES', 'y', 'Y', '1', 'on', 'On', 'ON',
    ];

    t.plan(trueString.length);

    trueString.forEach(function(value) {
        process.env.USE_TLS = value;

        var cfg = config({
            tls : {
                env : 'USE_TLS',
                type : 'boolean',
            },
        });

        t.deepEqual(cfg.tls, true, 'tls is true for ' + value);
    });

    t.end();
});

test('boolean, false values', function(t) {
    var falseString = [
        'false', 'False', 'FALSE', 'no', 'No', 'NO', 'n', 'N', '0', 'off', 'Off', 'OFF',
    ];

    t.plan(falseString.length);

    falseString.forEach(function(value) {
        process.env.USE_TLS = value;

        var cfg = config({
            tls : {
                env : 'USE_TLS',
                type : 'boolean',
            },
        });

        t.deepEqual(cfg.tls, false, 'tls is false for ' + value);
    });

    t.end();
});

test('boolean, invalid values', function(t) {
    var invalidString = [
        'invalid',
    ];

    t.plan(invalidString.length);

    invalidString.forEach(function(value) {
        process.env.USE_TLS = value;

        try {
            var cfg = config({
                tls : {
                    env : 'USE_TLS',
                    type : 'boolean',
                },
            });
            t.fail('This config should fail, invalid value for boolean')
        }
        catch (err) {
            t.equal(err.message, "Invalid boolean for tls : " + value, 'Failed with the correct error message');
        }
    });

    t.end();
});


test('boolean, default value', function(t) {
    t.plan(2);

    delete process.env.USE_TLS;

    try {
        var cfg = config({
            tls : {
                env : 'USE_TLS',
                type : 'boolean',
                default : true,
            },
        });

        t.deepEqual(cfg.tls, true, 'tls is default true');
    }
    catch (err) {
        t.fail('This config should not have failed')
    }

    try {
        var cfg = config({
            tls : {
                env : 'USE_TLS',
                type : 'boolean',
                default : false,
            },
        });

        t.deepEqual(cfg.tls, false, 'tls is default false');
    }
    catch (err) {
        t.fail('This config should not have failed')
    }

    t.end();
});
