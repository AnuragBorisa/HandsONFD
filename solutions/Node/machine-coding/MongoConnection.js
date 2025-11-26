import {MongoClient} from 'mongodb'

const url = 'mongodb://localhost:2701'
const dbName = 'my-mongo-db'

async function fetchDocuments(){
    try{
        const client = await MongoClient(url,{useUnifinedTopology:true})
        console.log('Connected to MongoDb')
        const db = client.db(dbName)
        const collection = db.collection('my-collection')

        const documents = await collection.find({}).toArray()
        console.log(documents,'documents')
    }
    catch(err){
        console.log(err,"Error")
    }
    finally{
        await client.close()
    }
}
fetchDocuments()