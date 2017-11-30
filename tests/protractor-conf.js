exports.config = {
    seleniumAddress: "http://localhost:9515",
    specs: ['T01-DataLoad.js','T02-AddJournal.js'],
    capabilities: {
        'browserName' : 'phantomjs'
    }
    
}