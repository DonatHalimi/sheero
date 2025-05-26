const geoip = require('geoip-lite');

function getClientIp(req) {
    const header = req.headers['x-forwarded-for'];
    return header ? header.split(',')[0].trim() : req.socket.remoteAddress;
};

function getClientUserAgent(req) {
    return req.headers['user-agent'] || 'Unknown';
};

function getLocationFromIP(ip) {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return {
            country: 'Development',
            city: 'Local Environment',
            region: 'Port 5000',
            isDevelopment: true
        };
    }

    try {
        const geo = geoip.lookup(ip);
        if (geo) {
            return {
                country: geo.country || 'Unknown',
                city: geo.city || 'Unknown',
                region: geo.region || 'Unknown',
                isDevelopment: false
            };
        }
    } catch (error) {
        console.error('Error looking up IP location:', error);
    }

    return {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        isDevelopment: false
    };
};

function parseUserAgent(userAgentString) {
    if (!userAgentString) return 'Unknown device';

    let device = 'Unknown device';
    let browser = 'Unknown browser';

    if (userAgentString.indexOf('iPhone') > -1) device = 'iPhone';
    else if (userAgentString.indexOf('iPad') > -1) device = 'iPad';
    else if (userAgentString.indexOf('Android') > -1) device = 'Android device';
    else if (userAgentString.indexOf('Windows Phone') > -1) device = 'Windows Phone';
    else if (userAgentString.indexOf('Windows') > -1) device = 'Windows PC';
    else if (userAgentString.indexOf('Macintosh') > -1) device = 'Mac';
    else if (userAgentString.indexOf('Linux') > -1) device = 'Linux PC';

    if (userAgentString.indexOf('OPR') > -1 || userAgentString.indexOf('Opera') > -1) browser = 'Opera';
    else if (userAgentString.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgentString.indexOf('Brave') > -1) browser = 'Brave';
    else if (userAgentString.indexOf('Yandex') > -1) browser = 'Yandex';
    else if (userAgentString.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgentString.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgentString.indexOf('Edge') > -1) browser = 'Edge';
    else if (userAgentString.indexOf('MSIE') > -1 || userAgentString.indexOf('Trident') > -1) browser = 'Internet Explorer';

    return `${device} using ${browser}`;
};

module.exports = { getClientIp, getClientUserAgent, getLocationFromIP, parseUserAgent };