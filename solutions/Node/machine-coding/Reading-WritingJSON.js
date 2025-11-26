import { promises as fs, Utf8Stream } from 'fs'

const path = './data.json'

export async function updateJsonFile(key, val) {
    try {
        const data = await fs.readFile(path, 'utf-8')
        const jsonData = JSON.parse(data)
        jsonData[key] = val
        await fs.writeFile(path, JSON.stringify(jsonData, null, 2))
        console.log('JSON Updated')
    }
    catch(err){
        console.error('Error updating file:', err);
    }

}