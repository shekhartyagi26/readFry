var _ = require('lodash');
var mongoose = require('mongoose')
var conn_pg_catalog_urls = mongoose.createConnection('mongodb://127.0.0.1/mipoty');

var schema_intresting_topics = mongoose.Schema({}, {
    strict: false,
    collection: 'intresting_topics'
});
var conn_intresting_topics = conn_pg_catalog_urls.model('intresting_topics', schema_intresting_topics);
var topics = {
    interests: [{
            "id": 1,
            "name": "cricket",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 2,
            "name": "hockey",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 3,
            "name": "tennis",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 4,
            "name": "chess",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 5,
            "name": "places",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 6,
            "name": "football",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 7,
            "name": "movie",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 8,
            "name": "songs",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 9,
            "name": "video",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 8,
            "name": "reading",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 10,
            "name": "cooking",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 11,
            "name": "dancing",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 12,
            "name": "drama",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 13,
            "name": "fashion",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 14,
            "name": "panting",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        }, {
            "id": 15,
            "name": "singing",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 16,
            "name": "puzzles",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 17,
            "name": "sketching",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 18,
            "name": "writing",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 19,
            "name": "driving",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        },
        {
            "id": 20,
            "name": "rock Climbing",
            "picture": "http://images.indianexpress.com/2016/05/virat1.jpg"
        }
    ]
}

var record = new conn_intresting_topics(topics);
record.save(function(err) {
    if (err) {
        console.log({ status: 0, message: err })
    } else {
        console.log('done');
        process.exit();
    }
})