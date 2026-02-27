Weather.IM Live Client
======================

Many moons ago, this client was the browser based interface named NWSChat Live.
The National Weather Service (NWS) subsequently migrated to Slack and this
client became obsolete.  But the [weather.im](https://weather.im) service is
still active and this interface is used there to allow browser based access
to the XMPP chat rooms.

Development
-----------

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

Deployment
----------

Use the deployment script to build and publish the `dist/` output:

- `bash deployment/weather_im.sh`
- `bash deployment/weather_im.sh --prod`

The script will:

- optionally run `npm ci`
- run `npm run lint`
- run `npm run build`
- in default mode: sync `dist/` into the deployment destination with `rsync`
- in `--prod` mode: run the production deployment branch (custom `rsync` command placeholder in the script)

Options:

- `--prod` enable production deployment branch
- `--help` show script usage

Environment overrides:

- `DEST` (default: `/opt/weather.im/html/live`)
- `INSTALL_DEPS` (`1` by default, set to `0` to skip `npm ci`)

Hosting Path
------------

- The built client is configured to work when hosted under `/live/` (or other subpaths), not just `/`.

Notes
-----

- This project uses Vite + ES modules while still depending on ExtJS (UMD).
- ExtJS runtime assets are synced from `node_modules/extjs-gpl/build` into
  `public/vendor/extjs-gpl/build` by `npm run sync:extjs`.
- The sync script runs automatically for `dev`, `start`, and `build` via
  npm `pre*` scripts.
- `public/vendor` is generated content and should not be committed to git.
- This application is desktop/laptop focused and is not designed or supported
  for mobile phone usage.

XMPP Transport
--------------

- Transport is configured in [src/config.js](src/config.js).
- Default is websocket (`XMPP_TRANSPORT: "websocket"`).
- To use websockets, set:
  - `XMPP_TRANSPORT: "websocket"`
  - `WEBSOCKET: "wss://<your-xmpp-host>/<websocket-endpoint>"`
- If websocket transport is selected without a URL, the client derives it
  from `BOSH` by converting to `wss://` and preserving the path.
- The client enforces TLS-only websocket endpoints (`wss://`).
