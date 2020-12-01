module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000'],
            startServerCommand: 'node index.js'
        },
        upload: {
            target: 'lhci',
            token: 'fb41c7d4-c665-4397-bab4-e13bbd6381ca',
            serverBaseUrl: 'http://localhost:9001'
        }
    }
}