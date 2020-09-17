var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");

var data = [{
    name: "Cloud's rest",
    image: "https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "blah blah blah"
}, {
    name: "Desert soso",
    image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "blah blah blah"
}, {
    name: "Somewhere in the sky",
    image: "https://images.pexels.com/photos/1239403/pexels-photo-1239403.jpeg?auto=compress&cs=tinysrgb&h=350",
    description: "blah blah blah"
}];

function seedDB() {
    // remove all campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed campgrounds!");
        }

        // add a few campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a campground");
                    // add a few comments
                    Comment.create({
                        text: "This place is good",
                        author: "Homer"
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        }
                    });
                }
            });
        });
    });
} // end of seedDB

module.exports = seedDB;