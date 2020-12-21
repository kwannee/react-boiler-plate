const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const {User} = require('./models/User')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://kwannee:256z1532@reactpractice.16uzj.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register',(req,res)=>{
    //회원 정보를 가져오면
    //DB에 넣는다.
    const user = new User(req.body)
    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
    })
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})