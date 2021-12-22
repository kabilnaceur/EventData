const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRoute = require('./routes/users')
const bodyParser = require ('body-parser')
const cors = require ('cors');
const PORT = 4000;

require('dotenv/config')
app.use(bodyParser.json())
app.use(cors());
app.use('/users',userRoute)

app.get('/',(rep,res)=>{
    res.send("we are one home")
})
mongoose.connect(process.env.DB_CONNECTION ,{useNewUrlParser:true,useUnifiedTopology: true}
)
mongoose.connection
        .once('open',() => console.log('connected'))
        .on('error ', (error)=> {
            console.log('your error',error)
        })
app.listen(PORT, () => {
            console.log(`Our app is running on port ${ PORT }`);
        });