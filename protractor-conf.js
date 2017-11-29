exports.config = {
    seleniumAddress: "http://localhost:9515",
    spects: ["TO1-LoadData.js"],
    capabilities: {
        'browserName' : 'phantomjs'
    }
    
}