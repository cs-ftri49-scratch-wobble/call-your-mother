const mongoose = require('mongoose');

//nested schemas info:
//https://mongoosejs.com/docs/subdocs.html
//https://stackoverflow.com/questions/39596625/nested-objects-in-mongoose-schemas
//https://stackoverflow.com/questions/15208711/mongoose-subdocuments-vs-nested-schema

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true }, //not having eventName or eventDate will prevent event from being created, but doesn't prevent kindred from being created if there are no events
  eventDate: { type: Date, required: true }, //setting to unique would prevent different kindred from having the same eventDate bc while required works at document level, unique looks at entire collection  https://www.mongodb.com/community/forums/t/how-to-enforce-uniqueness-for-the-sequence-field-in-a-nested-mongodb-schema-using-mongoose/261450/2
  eventDescription: { type: String },
});
const kindredSchema = new mongoose.Schema({
  kindredName: { type: Date, required: true, unique: true },
  date: { type: Date }, //most recent interaction date
  health: { type: Number },
  events: [eventSchema], //will hold multiple eventSchema objects
  label: [{ type: String }], //setting isn't a way to make relationshipLabel required, only that all relationLabel within the array must be non empty strings
  role: [{ type: String }],
  goals: [{ type: String }],
  suggestions: [{ type: String }],
  birthday: { type: Date },
});

module.exports = mongoose.model('Kindred', kindredSchema);

// Stretch:

// Potential properties for both User and Kindred:
// User and Kindred properties:
// Birthday - user input text
// Pop psychology categories like love language, astrological sign, Meyers Briggs

// Kindred-only properties:
// Relationship label - user selects from predetermined options (ex- partner, caretaker/dependent, family, friend, coworker, classmate, neighbor, mentor/mentee, other)
// Relationship roles - user input text (ex- emotional support, advice, fun hangout, thought provoking conversation, bonding over shared interests)
// Relationship health - stored after after being assessed
// Relationship development goals - user input text (ex- spend more time doing hobbies together, create a comfortable environment to talk about physical/mental health)
// Suggestions - stored after being generated from predetermined properties being sent to ChatGPT along with user’s own profile data if relevant, to create ideas for next interactions and gifts
