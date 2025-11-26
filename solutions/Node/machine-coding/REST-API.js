import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
app.use(cors())
app.use(bodyParser)
app.use(express.json())

const items = []

app.post('/item',(req,res)=>{
    const {todo} = req.body
    items.push(todo)
    res.status(201).json({msg:"Todos saved Successfully"})
})
app.get('/item',(req,res)=>{
    payload = items
    res.json({todos:payload})
})
app.get('/item/:id',(req,res)=>{
    const id = parseInt(req.params.id,10)
    const todo = items.find((value)=>value.id===id)
    if(!todo){
        return res.status(404).json({msg:"No Todo Found"})
    }
    res.json({todo:todo})
})
app.put('/item/:id',(req,res)=>{
    const id = parseInt(req.params.id,10)
    const idx = items.findIndex((value)=>value.id===id)
    if(idx==-1){
        return res.status(404).json({msg:'No todo found'})
    }
    const {todo} = req.body
    items[idx] = todo
    res.status(201).json({msg:"Todo updated "})
})

app.delete('/item/:id',(req,res)=>{
    const id = parseInt(req.params.id,10)
    const idx = items.findIndex((value)=>value.id===id)
    if(idx==-1){
        return res.status(404).json("No Todo to delete")
    }
    items.splice(idx,1)
    res.status(204).json({msg:"Todo updated"})
})

app.listen(PORT,()=>{
    console.log(`Server Running at ${PORT}` )
})
