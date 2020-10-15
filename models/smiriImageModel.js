const mongoose=require('mongoose');
const smiriImageSchema = new mongoose.Schema({
first_image:{type:String},
second_image:{type:String},
third_image:{type:String},
fourth_image:{type:String}
})

const smiriModel = mongoose.model("Smiriimage", smiriImageSchema);

module.exports=smiriModel;
