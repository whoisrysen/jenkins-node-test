var test = "https://www.reddit.com";
var test2 = "https://www.reddit.com/r/tifu"

module.exports = {
    ci: {
        collect: {
            url: [
                test,
                test2
            ]
        },
        upload: {
            target: 'lhci',
            token: '6b8e96c6-2857-4842-8812-d80eb7ecb5a3',
            serverBaseUrl: 'http://lhci-server:9001'
        }
    }
}