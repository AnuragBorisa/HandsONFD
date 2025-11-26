import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
app.use(cors())
app.use(bodyParser)
app.use(express.json())

function logRequests(req,res,next){
    const {method,url} = req
    const timeStamp = new Date().toISOString()
    console.log(`${timeStamp} ${method} ${url}`)
    next()
}
app.use(logRequests)
app.get('/',(req,res)=>{
        res.send('Hello World')
})
app.listen(PORT,()=>{
    console.log(`Server Running on PORT${PORT}`)
})