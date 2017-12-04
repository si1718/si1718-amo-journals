function makeString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;

}

function makeIdJournal() {
    var id = Math.floor(Math.random() * 100000000);
    return id;
}

describe('Add Journal', function() {
    it("Should add new journal", function() {
        browser.get("http://localhost:8080");

        var journals = element.all(by.repeater('journal in journals')).then(function(initialJournals) {
            browser.driver.sleep(2000);
            browser.get("http://localhost:8080/#!/");
            var randTitle = makeString();
            var randEditorial = makeString();
            var randArea = makeString();
            var randISSN = makeIdJournal();
            var randIDArticle = makeString();
            
            randISSN = String(randISSN);
            
            element(by.model('newJournal.title')).sendKeys("FromTesting"+randTitle);
            element(by.model('newJournal.editorial')).sendKeys(randEditorial);
            element(by.model('newJournal.area')).sendKeys(randArea);
            element(by.model('newJournal.issn')).sendKeys(randISSN);
            element(by.model('newJournal.idArticle')).sendKeys(randIDArticle);
  

            element(by.buttonText('Add')).click().then(function() {
                browser.driver.sleep(2000);
                browser.get("http://localhost:8080");

                var journalsAfterTest = element.all(by.repeater('journal in journals')).then(function(journals) {
                    expect(journals.length).toEqual(initialJournals.length + 1);
                });
            });
        });


    });
});
