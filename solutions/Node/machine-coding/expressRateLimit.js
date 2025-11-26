import express from 'express'
import { rateLimit } from 'express-rate-limit';

const app = express()
app.use(express.json())

const PORT = 3000

const limiter = rateLimit({
    windowMs:60*1000,
    max:5,
    message:'To many requests from this IP'

})

app.use(limiter)

app.get('/',(req,res)=>{
    res.send({msg:'Hello'})
})

app.listen(PORT,()=>{
    console.log(`Server running on PORT${PORT}`)
})
