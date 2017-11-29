describe('Data is loaded', function (){
    it("Should show a list of journals, more than 2", function(){
        browser.get("http://localhost:8080");
        var journals = element.all(by.repeater('journal in journals'));
        expect(journals.count()).toBeGreaterThan(2);
    });
});

// para correr el navegador en una terminal: phantomjs --webdriver=9615