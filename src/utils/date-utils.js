/**
 * Date utility helpers — no external dependencies.
 * Extracted here to break the circular import between
 * event-handlers.js and xmpp/handlers.js.
 */

/**
 * Parse a UTC date string in one of the legacy Ext formats into a native Date.
 *
 * @param {string} dtStr - The date string to parse
 * @param {string} [format] - Optional Ext-style format: "Ymd\\Th:i:s" or "Y-m-d\\Th:i:s"
 * @returns {Date|null}
 */
export function UTCStringToDate(dtStr, format) {
    let dt = null;

    if (typeof Date.parseDate === "function") {
        dt = Date.parseDate(dtStr, format);
    }

    if (!dt) {
        if (format === "Ymd\\Th:i:s") {
            const match = dtStr.match(
                /^(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})$/
            );
            if (match) {
                const [, year, month, day, hour, minute, second] = match;
                dt = new Date(
                    Date.UTC(
                        Number(year),
                        Number(month) - 1,
                        Number(day),
                        Number(hour),
                        Number(minute),
                        Number(second)
                    )
                );
            }
        } else if (format === "Y-m-d\\Th:i:s") {
            const match = dtStr.match(
                /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/
            );
            if (match) {
                const [, year, month, day, hour, minute, second] = match;
                dt = new Date(
                    Date.UTC(
                        Number(year),
                        Number(month) - 1,
                        Number(day),
                        Number(hour),
                        Number(minute),
                        Number(second)
                    )
                );
            }
        } else {
            const nativeDate = new Date(dtStr);
            if (!Number.isNaN(nativeDate.getTime())) {
                dt = nativeDate;
            }
        }
    }

    if (!dt) {
        return null;
    }
    return dt;
}
