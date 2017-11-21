"use strict";

var express = require("express");
var bodyParser = require('body-parser');
var helmet = require("helmet");
var BASE_API_PATH = "/api/v1";
var port = (process.env.PORT || 10000);


// Database related variables
var MongoClient = require("mongodb").MongoClient;
var mdbURL = "mongodb://andopr:andopr@ds261745.mlab.com:61745/si1718-amo-journals";
var db;

// Database connection
MongoClient.connect(mdbURL, { native_parser: true }, function(error, database) {
    if (error) {
        console.log("Connection to database failed" + error);
        process.exit(1);
    }

    db = database.collection("journals");
    app.listen(port, () => {
        console.log("Magic is happening on port " + port);
    });
});

var app = express();
app.use(bodyParser.json()); //use default JSON encoding/decoding
app.use(helmet());

// Method 1: GET a collection of journals
app.get(BASE_API_PATH + "/journals", function(request, response) {
    console.log("INFO: New GET request /journals");
    db.find({}).toArray(function(error, journals) {
        if (error) {
            console.error("WARNING: Data extraction from database failed - collection of journals");
            response.sendStatus(500); // 500: Internal server error
        }
        else {
            console.log("INFO: Sending journals: " + JSON.stringify(journals, 2, null));
            response.send(journals);
        }
    });
});

// Method 2: GET journals filtered by idJournal: One single resource expected
app.get(BASE_API_PATH + "/journals/:idJournal", function(request, response) {
    var idJournal = request.params.idJournal;
    if (!idJournal) {
        console.log("WARNING: New GET request to /journals/:idJournal without idJournal. Sending code 400...");
        response.sendStatus(400); // 400: Bad request
    }
    else {
        console.log("INFO: New GET request to /journal" + idJournal);
        db.findOne({ "idJournal": idJournal }, function(error, filteredJournalByID) {
            if (error) {
                console.error("Warning: Data extraction from database failed - journal by ISSN");
                response.sendStatus(500); // 500: Internal server error
            }
            else {
                if (filteredJournalByID) {
                    console.log("INFO: Sending Journal with requested ID..." + JSON.stringify(filteredJournalByID, 2, null));
                    response.send(filteredJournalByID);
                }
                else {
                    console.log("WARNING: There isn't a journal with requested ID " + idJournal);
                    response.sendStatus(404); // 404: Not found
                }
            }
        });
    }
});

/* Method 3: GET journals filtered by editorial
app.get(BASE_API_PATH + "/journals/:editorial", function(request, response) {
    var editorial = request.params.editorial;
    if (!editorial) {
        console.log("WARNING: New GET request to /journals/:editorial without editorial. Sending code 400...");
        response.sendStatus(400); // 400: Bad request
    }
    else {
        console.log("INFO: New GET request to /journals/" + editorial);
        db.find({ "editorial": editorial }, function(error, filteredJournalByEditorial) {
            if (error) {
                console.error("WARNING: Data extraction from database failed - single resource");
                response.sendStatus(500); // 500: Internal server error
            }
            else {
                console.log("INFO: Sending journals filtered by Editorial: " + JSON.stringify(filteredJournalByEditorial, 2, null));
                response.send(filteredJournalByEditorial);
            }
        });
    }
});
*/
//Method 3: POST a journal 
app.post(BASE_API_PATH + "/journals", function(request, response) {
    var newJournal = request.body;
    if (!newJournal) {
        console.log("WARNING; New POST request to /journals/ withouth journal, sending 400...");
        response.sendStatus(400); // 400: Bad request
    }
    else {
        console.log("INFO: New POST request to /journals with body: " + JSON.stringify(newJournal, 2, null));

        if (!newJournal.title || !newJournal.editorial || !newJournal.issn || !newJournal.area) {
            console.log("WARNING: The journal " + JSON.stringify(newJournal, 2, null) + "is not well-formed, sending 422...");
            response.sendStatus(422); // 422: Unprocessable entitiy
        }
        else {
            var idJournal = request.body.issn;
            newJournal.idJournal = idJournal;
            db.findOne({ "idJournal": idJournal }, function(error, journal) {
                if (error) {
                    console.error("WARNING: Error getting data from Database");
                    response.sendStatus(500); // 500: Internal server error
                }
                else {
                    if (journal) {
                        console.log("WARNING: The journal " + JSON.stringify(newJournal, 2, null) + "already exists, sending 409");
                        response.sendStatus(409); // 409: Conflict
                    }
                    else {
                        db.insertOne(request.body, (error, journal) => {
                            if (error) {
                                console.error("WARNING: Error inserting data in Database");
                                response.sendStatus(500); // 500: Internal server error
                            }
                            else {
                                console.log("INFO: Adding journal " + JSON.stringify(newJournal, 2, null));
                                response.sendStatus(201); //201: Created
                            }
                        });
                    }

                }
            });

        }

    }
});

// Method 4: POST over a single resource 
app.post(BASE_API_PATH + "/journals/:idJournal", function(request, response) {
    var idJournal = request.params.idJournal;
    console.log("WARNING: New PUT request to /journals/" + idJournal + ", sending 405...");
    response.sendStatus(405); // 405: Method not allowed
});

//Method 5: PUT over a collection - It is not allowed to update the whole collection of journals
app.put(BASE_API_PATH + "/journals", function(request, response) {
    console.log("WARNING: New PUT request to /journals/, sending 405...");
    response.sendStatus(405); // 405: Method not allowed
});

//Method 6: PUT over a single resource - update a journal
app.put(BASE_API_PATH + "/journals/:idJournal", function(request, response) {
    var updatedJournal = request.body;
    var idJournal = request.params.idJournal;
    if (!updatedJournal) {
        console.log("WARNING: New PUT request to /journals/ without journal, sending 400...");
        response.sendStatus(400); // 400: Bad request
    }
    else {
        console.log("INFO: New PUT request to /journals/" + idJournal + "with data " + JSON.stringify(updatedJournal, 2, null));

        if (!updatedJournal.title || !updatedJournal.issn || !updatedJournal.editorial || !updatedJournal.area) {
            console.log("WARNING: The journal " + JSON.stringify(updatedJournal, 2, null) + "is not well-formed or empty, sending 422...");
            response.sendStatus(422); // 422: Unprocessable entity
        }
        else {
            db.findOne({ "idJournal": idJournal }, function(error, journal) {
                if (error) {
                    console.error("WARNING: Data extraction from database failed - update single resource (find journal with id)");
                    journal.sendStatus(500); // 500: Internal server error
                }
                else {
                    if (journal) {
                        updatedJournal.issn = journal.issn;
                        updatedJournal.title = journal.title;
                        updatedJournal.area = journal.area;
                        updatedJournal.editorial = journal.editorial;
                        db.update({ "idJournal": idJournal }, updatedJournal);
                        console.log("INFO: Modifying journal with idJournal " + idJournal + "with data " + JSON.stringify(updatedJournal, 2, null));
                        response.send(updatedJournal);
                    }
                    else {
                        console.log("WARNING: There isn't a journal with given journal ID: " + idJournal);
                        response.sendStatus(404); // 404: Not found
                    }
                }
            });

        }
    }

});


// DELETE over a collection
app.delete(BASE_API_PATH + "/journals", function (request, response) {
    console.log("INFO: New DELETE request to /journals");
    db.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // 500: Internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the journals (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // 204: No Content
            } else {
                console.log("WARNING: There are no journals to delete");
                response.sendStatus(404); // 404: Not Found
            }
        }
    });
});


// Method 8: DELETE over a single resource
app.delete(BASE_API_PATH + "/journals/:idJournal", function(request, response) {
    var idJournal = request.params.idJournal;
    if (!idJournal) {
        console.log("WARNING: New DELETE request to /journals/:idJournal without journal ID, sending 400...");
        response.sendStatus(400); // 400: Bad request
    }
    else {
        console.log("INFO: New DELETE request to /journals/" + idJournal);
        db.remove({ "idJournal": idJournal }, {}, function(error, numRemovedJournals) {
            if (error) {
                console.log("WARNING: Error removing data from database");
                response.sendStatus(500); // 500: Internal server error
            }
            else {
                console.log("INFO: Journals removed: " + numRemovedJournals);
                if (numRemovedJournals == 1) {
                    console.log("INFO: The journal with id " + idJournal + "has been sucessfully deleted, sending 204");
                    response.sendStatus(204); // 204: No content
                }
                else {
                    console.log("WARNING: There are no journals to delete");
                    response.sendStatus(404); // 404: Not found
                }
            }
        });
    }
});