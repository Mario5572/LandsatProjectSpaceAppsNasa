import express from 'express'
import path from 'path'
import { getData } from './src/EarthDataReq/DataRequester.mjs';
import { fileURLToPath } from 'url';
import { coordinatesOfDate } from './src/ServerDependencies/satellitePredictions.mjs';
import { sendEmail } from './src/ServerDependencies/mandadorDeGmails.mjs';
//Este es el hilo principal del servidor, basicamente aqui ocurrira todo


const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(express.static('public')); //Aqui deben ir todos los archivos estaticos css y js del cliente
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/locationPicker', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'locationPicker.html'))
})

app.get('/mapstyles/darkMap.json', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'mapStyles', 'darkMap.json'))
})
app.get('/mapstyles/lightMap.json', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'mapStyles', 'lightMap.json'))
})
app.get('/liveDemo', (req,res)=>{
    res.sendFile(path.join(__dirname,'public','liveDemo.html'))
})
app.post('/request', (req, res) => {
    console.log('Received POST request:', req.body); // Log the received data
    const { name, gmail, lng, lat } = req.body;
    if(name == undefined || gmail == undefined || lng == undefined ||lat == undefined) return -1
    console.log(`Name: ${name}, Gmail: ${gmail}, Location: ${lat} lat ${lng} long`);
    getData(lat,lng,name).then(()=>{
        sendEmail({
            subject: `Tus datos del landsat han llegado ${name}`,
            text:'Aqui tienes los archivos relacionados con tu query',
            dest:[`${gmail}`],
            attachments: [
                {
                    filename: 'data.csv',
                    path: './src/EarthDataReq/p1.csv'
                },
            ]
        })
    })
    res.json({ message: 'Data received successfully!' });
});
app.get('/demo' , (req,res) => {
    const coords = coordinatesOfDate(new Date())
    console.log(coords)
    res.end(JSON.stringify(coords))
})
  
app.listen(port,'0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
})

