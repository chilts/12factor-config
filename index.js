
var valid = {
    type : {
        'string'   : true,
        'integer'  : true,
        'boolean'  : true,
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
        if ( value === null ) {
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
            if ( value === 'true' ) {
                cfg[name] = true;
            }
            else if ( value === 'false' ) {
                cfg[name] = false;
            }
            else {
                throw new Error('Invalid boolean for ' + name + ' : ' + value);
            }
        }
        else if ( opt.type === 'integer' ) {
            cfg[name] = parseInt(value, 10);
        }
        else {
            throw new Error('Program error');
        }
    });

    return cfg;
};

module.exports = config;
