const namedEmitters = {};
const {EventEmitter} = require('events');

module.exports = {
    getTimeoutInMilliSeconds(timeout, units) 
    {
        if (!timeout || typeof timeout != 'number') return 0;
        if (!units) return timeout * 1000;
        units = units.toLowerCase();
        if (units == 'ms' || units.startsWith('mil')) return timeout;
        if (units.startsWith('s')) return timeout * 1000;
        if (units.startsWith('m')) return timeout * 60000;
        if (units.startsWith('h')) return timeout * 3600000;
        if (units.startsWith('d')) return timeout * 86400000;
        return 0;
    },

    makeStatus(text, fill, shape, ex) {
        if (text === true) {
            text = fill;
            fill = shape;
            shape = ex;
            ex = true;
        }
    
        let status = {fill, shape, text};
        return ex? {payload: status}: status;
    },

    makeEntityId(partialId, defaultDomain) {
        if (typeof partialId != 'string') return null;
        let parts = partialId.split('.');
        if (parts.length > 1) return `${parts[0].trim()}.${parts[1].trim()}`;
        if (!defaultDomain || parts.length < 1) return null;
        let dparts = defaultDomain.split('.');
        return `${dparts[0].trim()}.${parts[0].trim()}`;
    },

    getNamedEmitter(name, destroy) {
        if (typeof name != 'string' || name.length < 1) return null;

        let emitter = namedEmitters[name];
        if (!emitter) {
            if (destroy) return null;
            emitter = namedEmitters[name] = new EventEmitter();
        }

        if (destroy) {
            delete namedEmitters[name];
        }

        return emitter;
    }
}