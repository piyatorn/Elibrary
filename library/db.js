const mongoose = require('mongoose');

//const dbUrl =  "mongodb://localhost:27017/ElibraryDB";
const dbUrl =  "mongodb+srv://admin:admin@project-x.uxv4g.mongodb.net/ElibraryDB";


mongoose.connect(dbUrl,{
    // สั่งให้ connect
    useNewUrlParser:true,
    useUnifiedTopology:true,  // ไม่มีจะขึ้น DeprecationWarning
    useCreateIndex:true     
});