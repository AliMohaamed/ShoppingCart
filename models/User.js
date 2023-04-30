const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    email : {
        type : String ,
        required : true ,
        unique: true,
        // lowercase: true,
    } ,
    password : {
        type : String ,
        required : true
    }
})

// userSchema.method.hashPassword = function(password){
//     // Sync : function بتتعمل عندي البرنامج لما بيخش بيوقف البرنامج كله لحد ما يخلصها في عكس الكول باك فانكشن وفي الطريقه دي وفي دي
//     return bcrypt.hashSync(password , bcrypt.genSaltSync(5) , null) ;
// }

// userSchema.method.comparePassword = function(password){ //error here
//     return bcrypt.compareSync(password , this.password);
// }



module.exports = mongoose.model('User' , userSchema) ;