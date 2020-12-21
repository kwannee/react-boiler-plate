const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser =require('cookie-parser')
const {User} = require('./models/User')

const config = require('./config/key')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err))

app.get('/', (req, res) => {
  res.send('되나요?')
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

app.post('/login',(req,res)=>{
    
    //요청된 이메일이 DB에 있는지 찾는다.
    User.findOne({email : req.body.email},(err,user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "없는 이메일 입니다."
            })
        }
        user.comparePassword(req.body.password,(err,isMatch) =>{
            if(!isMatch) return res.json({loginSuccess:false,message:"비밀번호가 틀렸습니다."})
            
            //비밀번호도 맞다면 토큰을 만듦.
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                //토큰을 저장한다. 쿠키나 로컬스토리지에
                //여기서는 쿠키에
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess:true,userId:user._id})

            })
        })
    })
    //있다면, 패스워드 확인

    //비밀번호도 맞으면 토큰 생성.
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})