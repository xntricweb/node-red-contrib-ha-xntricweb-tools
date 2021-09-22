let tool = require('../src');

// let {describe, expect, test} = require('jest');

describe('getTimeoutInMilliseconds', function() {
    test('it should return 0 if provided bad data', function() {
        expect(tool.getTimeoutInMilliSeconds()).toBe(0);
        expect(tool.getTimeoutInMilliSeconds('abc')).toBe(0);
        expect(tool.getTimeoutInMilliSeconds(null)).toBe(0);
        expect(tool.getTimeoutInMilliSeconds(undefined, null)).toBe(0);
        expect(tool.getTimeoutInMilliSeconds({})).toBe(0);
        expect(tool.getTimeoutInMilliSeconds([])).toBe(0);
    });

    test('it should convert values to milliseconds', function() {
        let ms = 1,
            s = ms * 1000,
            m = s * 60,
            h = m * 60,
            d = h * 24;
        let unitMultipliers = {
            ms, s, m, h, d,
            undefined: s,
            null: s,
            milliseconds: ms,
            seconds: s,
            minutes: m,
            hours: h,
            days: d
        };
        let tests = [
            { timeout: 3, units: undefined},
            { timeout: 3, units: null },
            { timeout: 3, units: 'ms' },
            { timeout: 3, units: 's' },
            { timeout: 3, units: 'm' },
            { timeout: 3, units: 'h' },
            { timeout: 40, units: 's' },
            { timeout: 56, units: 'h' },
            { timeout: 4, units: 'd' },
            { timeout: 3, units: 'd' },
            { timeout: 3, units: 'milliseconds' },
            { timeout: 3, units: 'seconds' },
            { timeout: 3, units: 'minutes' },
            { timeout: 3, units: 'hours' },
            { timeout: 40, units: 'seconds' },
            { timeout: 56, units: 'hours' },
            { timeout: 4, units: 'days' },
            { timeout: 3, units: 'days' }, 
        ];

        for(let {timeout, units} of tests) {
            expect(tool.getTimeoutInMilliSeconds(timeout, units)).toBe(timeout * unitMultipliers[units]);
        }
    });
});

describe('makeEntityId', function() {
    test('it should return null if with bad input', function() {
        expect(tool.makeEntityId()).toBe(null);
        expect(tool.makeEntityId('abc')).toBe(null);
        expect(tool.makeEntityId(undefined)).toBe(null);
        expect(tool.makeEntityId(null)).toBe(null);
        expect(tool.makeEntityId({})).toBe(null);
    });

    test('it should form valid entity_ids', function() {
        expect(tool.makeEntityId('a.b')).toBe('a.b');
        expect(tool.makeEntityId('switch.deck_light')).toBe('switch.deck_light');
        expect(tool.makeEntityId('binary_sensor.person_motion')).toBe('binary_sensor.person_motion');
        expect(tool.makeEntityId('switch.shed_light', 'light')).toBe('switch.shed_light');
        expect(tool.makeEntityId('shed_light', 'light')).toBe('light.shed_light');
        expect(tool.makeEntityId('yard_switch', 'switch.shed_light')).toBe('switch.yard_switch');
        expect(tool.makeEntityId('switch.shed.light', 'light.yard.truck')).toBe('switch.shed');
    });
});

describe('getNamedEmitter', function() {
    test('it should return null with bad input', function() {
        expect(tool.getNamedEmitter(undefined)).toBe(null);
        expect(tool.getNamedEmitter(null)).toBe(null);
        expect(tool.getNamedEmitter()).toBe(null);
        expect(tool.getNamedEmitter({})).toBe(null);
        expect(tool.getNamedEmitter('')).toBe(null);
    })
    test('it should retrieve a named emitter', function() {
        let emitter = tool.getNamedEmitter('test-a'); 
        expect(emitter).toBe(tool.getNamedEmitter('test-a'));
        expect(emitter).not.toBe(tool.getNamedEmitter('not-test-a'));
    })
    test('it should DESTROY a named emitter', function() {
        let emitter = tool.getNamedEmitter('test-b'); 
        expect(tool.getNamedEmitter('test-b', true)).toBe(emitter);
        expect(tool.getNamedEmitter('test-b')).not.toBe(emitter);
    })
})