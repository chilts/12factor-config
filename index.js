var util = require('util')

var valid = {
    type : {
        'string'   : true,
        'integer'  : true,
        'boolean'  : true,
        'enum'     : true,
    },
    boolean : {
        'true'     : true,
        'false'    : false,
        't'        : true,
        'f'        : false,
        'yes'      : true,
        'no'       : false,
        'y'        : true,
        'n'        : false,
        'on'       : true,
        'off'      : false,
        '1'        : true,
        '0'        : false,
    },
};

function config(opts) {
    var cfg = {};

    var options = Object.keys(opts);

    options.forEach(function(name) {
        // set some defaults
        var opt = opts[name];
        opt.type = opt.type || 'string';

        if ( !valid.type[opt.type] ) {
            throw new Error('Invalid type for ' + name + ': ' + opt.type);
        }

        // set the default if nothing set in the env
        var value;
        if ( opt.default === undefined ) { // don't just check 'opt.default' since it might be 0 or false
            value = process.env[opt.env];
        }
        else {
            value = process.env[opt.env] || opt.default;
        }

        // if we don't have a value, check whether it is required or not
        if ( value === null || value === undefined ) {
            if ( opt.required ) {
                throw new Error("Required value not provided: " + name);
            }
            // not required, so nothing else needed for this one
            return;
        }

        // now convert to the wanted type
        if ( opt.type === 'string' ) {
            cfg[name] = value;
        }
        else if ( opt.type === 'boolean' ) {
            var booleanValue;
            if ( typeof value === 'boolean' ) {
                booleanValue = value;
            }
            else if ( typeof value === 'string' ) {
                booleanValue = valid.boolean[value.toLowerCase()];
            }

            if ( booleanValue !== undefined ) {
                cfg[name] = booleanValue;
            }
            else {
                throw new Error('Invalid boolean for ' + name + ' : ' + value);
            }
        }
        else if ( opt.type === 'integer' ) {
            cfg[name] = parseInt(value, 10);
        }
        else if ( opt.type === 'enum' ) {
            // firstly, check that values has been given and is greater than 0
            if ( !opt.values || !Array.isArray(opt.values) || opt.values.length === 0 ) {
              throw new Error(util.format("No values specified for the '%s' enum", name))
            }

            // check that this value is allowed
            var enumOk = false;
            opt.values.forEach(function(enumValue) {
                if ( value === enumValue ) {
                    enumOk = true;
                }
            });
            if ( !enumOk ) {
              throw new Error(util.format('Invalid enum for %s(%s) : %s', name, opt.values.join(', '), value));
            }
            cfg[name] = value
        }
        else {
            throw new Error('Program error');
        }
    });

    return cfg;
};

module.exports = config;
