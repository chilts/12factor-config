var test = require('tape');

var config = require('../');

process.env.COLUMNS = 104;
process.env.SHELL = '/bin/bash';
delete process.env.blah1;
delete process.env.blah2;
process.env.HISTSIZE = 1000;

test('basic', function(t) {
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
    console.log(cfg);

    t.equal(cfg.columns, 104, 'Columns should be 104');
    t.equal(typeof cfg.columns, 'number', 'Columns should be a number');

    t.equal(cfg.shell, '/bin/bash', 'Shell should be /bin/bash');
    t.equal(typeof cfg.columns, 'number', 'Columns should be a number');

    t.equal(cfg.blah1, undefined, 'Blah1 should be not be defined');

    t.equal(cfg.blah2, 'blah2', 'Blah2 should take the default value');
    t.equal(typeof cfg.blah2, 'string', 'Blah2 should be a string');

    t.equal(cfg.histSize, 1000, 'histSize should be set correctly');
    t.equal(typeof cfg.histSize, 'number', 'histSize should be a number');

    t.end();
});
