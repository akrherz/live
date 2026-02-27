export function stripHtml(text) {
    return String(text)
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

export function parseLSRDetails(messageText, attributes = {}) {
    const details = {
        event: "",
        magnitude: "",
        city: "",
        county: "",
        state: "",
        remark: "",
    };

    if (!messageText) {
        return {
            ...details,
            ...Object.fromEntries(
                Object.entries(attributes).filter(([, value]) => Boolean(value)),
            ),
        };
    }

    const normalizedText = stripHtml(messageText);
    const [headline, ...remarkParts] = normalizedText.split(" -- ");
    details.remark = remarkParts.join(" -- ").trim();

    const locationMatch = headline.match(/^(.+?)\s*\[([^\]]+)\]/);
    if (locationMatch) {
        details.city = locationMatch[1].trim();
        const countyState = locationMatch[2].trim();
        const countyStateMatch = countyState.match(
            /^(.+?)(?:\s+Co\.?|\s+County)?\s*,\s*([A-Z]{2})$/i,
        );
        if (countyStateMatch) {
            details.county = countyStateMatch[1].trim();
            details.state = countyStateMatch[2].toUpperCase();
        } else {
            details.county = countyState;
        }
    }

    const reportsMatch = headline.match(/reports\s+(.+?)\s+at\s/i);
    if (reportsMatch) {
        const eventMagnitude = reportsMatch[1].trim();
        const ofParts = eventMagnitude.split(/\s+of\s+/i);
        if (ofParts.length > 1) {
            details.event = ofParts[0].trim();
            details.magnitude = ofParts.slice(1).join(" of ").trim();
        } else {
            details.event = eventMagnitude;
        }
    }

    details.event = attributes.event || details.event;
    details.magnitude = attributes.magnitude || details.magnitude;
    details.city = attributes.city || details.city;
    details.county = attributes.county || details.county;
    details.state = attributes.state || details.state;
    details.remark = attributes.remark || details.remark;

    return details;
}
