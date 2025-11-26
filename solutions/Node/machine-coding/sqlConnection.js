
import pkg from 'pg'

const {Client} = pkg

const client = new Client({
    host:'localhost',
    port:8080,
    user:'myUser',
    password:'abcd',
    database:'myDatabase'
})

async function fetchRows(){
    try{
        await client.connect()
        console.log('Connected to client')
        
        const result = client.query('SELECT * FROM mytable')
        console.log(result.rows,'Rows')
    }
    catch(err){
        console.log(err,"ERROR")
    }
    finally{
        client.end()
    }

}
fetchRows()