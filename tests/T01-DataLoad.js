var fs = require('fs');

function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}


describe('Data is loaded', function() {
    it("Should show a list of journals, more than 4", function() {
        browser.get("http://localhost:8080");
        var journals = element.all(by.repeater('journal in journals'));
        browser.driver.sleep(2000);

        browser.takeScreenshot().then(function(png) {
            writeScreenShot(png, 'ng-test.png');
        });

        expect(journals.count()).toBeGreaterThan(4);
    });
});

// para correr el navegador en una terminal: phantomjs --webdriver=9515
