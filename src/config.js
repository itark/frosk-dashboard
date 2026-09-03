// Backend host follows whatever host served this page — 'localhost' when opened
// on the same Mac, the Mac's LAN IP when opened from another device (e.g. a
// phone), so no per-device editing is needed. Equity/crypto stay on their
// fixed ports (8080/8081) on that same host.
const apiHost = window.location.hostname;

const config = {
    // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '/frosk',
    defaultPath: '/dashboard/default',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12,
    baseApi: `http://${apiHost}:8080`,
    cryptoBaseApi: `http://${apiHost}:8081`,
    krakenFuturesBaseApi: `http://${apiHost}:8082`,
};

export default config;
