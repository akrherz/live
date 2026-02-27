import test from "node:test";
import assert from "node:assert/strict";
import { parseLSRDetails } from "../src/xmpp/lsr-parser.js";

test("parseLSRDetails parses standard LSR body text", () => {
    const bodyText =
        "2 NE Jacksonville Inter [Duval Co, FL] ASOS reports Tstm Wnd Gst of M45 MPH at 2:00 PM EST -- ASOS station KJAX Jacksonville Intl Airport. https://mesonet.agron.iastate.edu/lsr/?by=wfo&wfo=JAX&sts=202602271900&ets=202602271900";

    const parsed = parseLSRDetails(bodyText);

    assert.equal(parsed.event, "Tstm Wnd Gst");
    assert.equal(parsed.magnitude, "M45 MPH");
    assert.equal(parsed.city, "2 NE Jacksonville Inter");
    assert.equal(parsed.county, "Duval");
    assert.equal(parsed.state, "FL");
    assert.match(parsed.remark, /ASOS station KJAX Jacksonville Intl Airport\./);
});

test("parseLSRDetails strips HTML and honors attribute overrides", () => {
    const htmlText =
        '<p>2 NE Jacksonville Inter [Duval Co, FL] ASOS <a href="https://example">reports Tstm Wnd Gst of M45 MPH</a> at 2:00 PM EST -- ASOS station KJAX Jacksonville Intl Airport.</p>';

    const parsed = parseLSRDetails(htmlText, {
        event: "Wind Gust",
        state: "FL",
    });

    assert.equal(parsed.event, "Wind Gust");
    assert.equal(parsed.magnitude, "M45 MPH");
    assert.equal(parsed.city, "2 NE Jacksonville Inter");
    assert.equal(parsed.county, "Duval");
    assert.equal(parsed.state, "FL");
});
