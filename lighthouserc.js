if (process.env.AS_CRON) {
    var hash = Date.now()
        .toString(16)
        .split('')
        .reverse()
        .join('');
    var msg = "Automated report for " + process.env.BUILD_DISPLAY_NAME;

    process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH = hash;
    process.env.LHCI_BUILD_CONTEXT__COMMIT_TIME = new Date().toISOString();
    process.env.LHCI_BUILD_CONTEXT__CURRENT_BRANCH = 'Cron';
    process.env.LHCI_BUILD_CONTEXT__COMMIT_MESSAGE = msg;
    process.env.LHCI_BUILD_CONTEXT__AUTHOR = 'Jenkins';
    process.env.LHCI_BUILD_CONTEXT__AVATAR_URL = 'https://avatars1.githubusercontent.com/u/71597567?s=460&v=4';
    process.env.LHCI_BUILD_CONTEXT__EXTERNAL_BUILD_URL = process.env.BUILD_URL;
}

var urls = process.env.URLS.split('\n');

module.exports = {
    ci: {
        collect: {
            url: urls
        },
        upload: {
            target: 'lhci',
            token: '6b8e96c6-2857-4842-8812-d80eb7ecb5a3',
            serverBaseUrl: 'http://lhci_server:9000'
        }
    }
}