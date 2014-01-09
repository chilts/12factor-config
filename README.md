# 12factor-config #

A config module which only reads the environment. For Node.js that means `process.env`. We will not ever use `NODE_ENV`
here since each environment should specify everything it needs and nothing should be dependent on being a particular
environment (such as 'development', 'testing', 'staging' or 'production').

```javascript
var config = require('12factor-config');

var cfg = config({
    redisUrl : {
        env      : 'REDIS_URL',
        type     : 'string', // default
        required : true,
    },
    logfile : {
        env      : 'APPNAME_LOG_FILE',
        type     : 'string',
        default  : '/var/log/appname.log',
        required : true,
    },
    port : {
        env      : 'APPNAME_PORT',
        type     : 'integer',
        default  : '8000',
        required : true,
    },
    debug : {
        env      : 'APPNAME_DEBUG',
        type     : 'boolean',
        default  : false,
    },
});
```

Note: I'm not showing any example which used `NODE_ENV` since http://12factor.net/config
says that each environment specifies everything exactly rather than all stemming from an
overall environment type.

## Author ##

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

## License ##

MIT - http://chilts.mit-license.org/2013/

(Ends)
