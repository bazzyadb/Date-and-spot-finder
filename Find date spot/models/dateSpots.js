const mongoose = require('mongoose');
var DateSpotSchema = new mongoose.Schema({
Name: {
    type: String,
    required: true
},
Latitude: {
    type: Number,
    required: true
},
Longitude: {
    type: Number,
    required: true
},
Address: {
    type: String,
    required: true
},
Type: {
  type: String,
  required: true
},
Contact: {
    type: String,
    required: true
} ,
Rating: {
    type: Number,
    required: true
},
NumberOfMalesinADay: {
    type: Number,
    required: true
},
NumberOfFeMalesinADay: {
    type: Number,
    required: true
},
ZipCode: {
    type: String,
    required: true
},
StartTime: {
  type: Number,
  required: true
},
EndTime: {
  type: Number,
  required: true
},
AverageDateTimeInMinutes: {
  type: Number,
  required: true
},
AverageDateCostinINR: {
  type: Number,
  required: true
}
});
module.exports= mongoose.model("userinfo", DateSpotSchema);
