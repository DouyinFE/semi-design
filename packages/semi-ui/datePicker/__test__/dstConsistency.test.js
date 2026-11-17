import { zonedTimeToUtc } from '../../../semi-foundation/utils/date-fns-extra';

describe('DatePicker timezone conversion across host timezones', () => {
    it('uses the earlier occurrence of a repeated New York time', () => {
        const wallTime = new Date(2026, 10, 1, 1, 30, 12, 123);
        expect(zonedTimeToUtc(wallTime, 'America/New_York').toISOString()).toBe('2026-11-01T05:30:12.123Z');
    });

    it('uses the earlier occurrence of a repeated half-hour transition', () => {
        const wallTime = new Date(2026, 3, 5, 1, 45);
        expect(zonedTimeToUtc(wallTime, 'Australia/Lord_Howe').toISOString()).toBe('2026-04-04T14:45:00.000Z');
    });

    it('moves a skipped wall time forward whether or not the host skips it', () => {
        expect(zonedTimeToUtc(new Date(2026, 2, 8, 2, 30), 'America/New_York').toISOString()).toBe('2026-03-08T07:30:00.000Z');
        expect(zonedTimeToUtc(new Date(2026, 9, 4, 2, 15), 'Australia/Lord_Howe').toISOString()).toBe('2026-10-03T15:45:00.000Z');
    });

    it.each([['America/New_York', '2026-10-26T16:30:12.123Z'], ['Asia/Kathmandu', '2026-10-26T06:45:12.123Z'], [8, '2026-10-26T04:30:12.123Z']])('preserves ordinary dates for %s', (zone, expected) => {
        expect(zonedTimeToUtc(new Date(2026, 9, 26, 12, 30, 12, 123), zone).toISOString()).toBe(expected);
    });

    it('does not mutate the input Date', () => {
        const wallTime = new Date(2026, 10, 1, 1, 30);
        const timestamp = wallTime.getTime();
        zonedTimeToUtc(wallTime, 'America/New_York');
        expect(wallTime.getTime()).toBe(timestamp);
    });

    it('preserves invalid Date and timezone results', () => {
        expect(Number.isNaN(zonedTimeToUtc(new Date(NaN), 'America/New_York').getTime())).toBe(true);
        expect(Number.isNaN(zonedTimeToUtc(new Date(), 'Invalid/Zone').getTime())).toBe(true);
    });
});
