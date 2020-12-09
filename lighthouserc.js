const fs = require('fs');

var file = fs.readFileSync('lighthouserc-systems.json');
var systemsConfig = JSON.parse(file);

if (!systemsConfig[process.env.SYSTEM]) {
    console.log('Selected SYSTEM is not configured.');
    process.exit(1);
}

var system = systemsConfig[process.env.SYSTEM];

if (!system.token || system.token === '') {
    console.log('Selected SYSTEM is missing a build token.');
    process.exit(1);
}

var urls = process.env.URLS.split('\n');

if (system.domain) {
    var newUrls = [];

    for (const url of urls) {
        if (Array.isArray(system.domain) && url.includes('<SYSTEM>')) {
            for (const domain of system.domain) {
                newUrls.push(url.replace('<SYSTEM>', domain))
            }
        }
        else {
            newUrls.push(url.replace('<SYSTEM>', system.domain));
        }
    }

    urls = newUrls;
}

if (process.env.SCHEDULED === 'true') {
    // Create scheduled report with artificial build context.
    var hash = Date.now()
        .toString(16)
        .split('')
        .reverse()
        .join('');

    var msg = 'Scheduled report for build ' + process.env.BUILD_DISPLAY_NAME;
    if (process.env.GIT_COMMIT_MESSAGE) {
        msg += ' @ "' + process.env.GIT_COMMIT_MESSAGE + '"';
    }

    process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH = hash;
    process.env.LHCI_BUILD_CONTEXT__COMMIT_TIME = new Date().toISOString();
    process.env.LHCI_BUILD_CONTEXT__CURRENT_BRANCH = process.env.GIT_BRANCH;
    process.env.LHCI_BUILD_CONTEXT__COMMIT_MESSAGE = msg;
    process.env.LHCI_BUILD_CONTEXT__AUTHOR = 'jenkins';
    process.env.LHCI_BUILD_CONTEXT__AVATAR_URL = 'https://avatars0.githubusercontent.com/u/107424?s=200&v=4';
    process.env.LHCI_BUILD_CONTEXT__EXTERNAL_BUILD_URL = process.env.BUILD_URL;
}
else {
    // Create commit-based report with necessary "forwards" of Jenkins environment variables.
    process.env.LHCI_BUILD_CONTEXT__CURRENT_BRANCH = process.env.GIT_BRANCH;
    process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH = process.env.GIT_COMMIT;
    process.env.LHCI_BUILD_CONTEXT__EXTERNAL_BUILD_URL = process.env.BUILD_URL;
}

module.exports = {
    ci: {
        collect: {
            url: urls,
            settings: {
                chromeFlags: '--no-sandbox'
            }
        },
        assert: {
            preset: 'lighthouse:recommended',
            assertions: {
                'first-contentful-paint': [
                    'error',
                    { maxNumericValue: 2000, aggregationMethod: 'optimistic' }
                ],
                'interactive': [
                    'error',
                    { maxNumericValue: 5000, aggregationMethod: 'optimistic' }
                ]
            }
        },
        upload: {
            target: 'lhci',
            token: system.token,
            serverBaseUrl: 'http://lhci-server:9001'
        }
    }
}