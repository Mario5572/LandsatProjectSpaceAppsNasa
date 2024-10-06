import { obtenerToken } from "./auth.mjs";
import axios from "axios";
import fs from 'node:fs'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
import path from 'path'

const token = 'isvrjD-SPn3lBGkgGW0mK5xsheD6Ouw-2afWX7-8zy39zbY0dySaZFxX3kgUS0mBV7IC05WizwnB4hifmqCPiw'
console.log(token)

// Define la URL base de la API
const apiUrl = 'https://appeears.earthdatacloud.nasa.gov/api';

// Función para crear una solicitud de datos (POST)
async function requestLandsatData(latitude, longitude, startDate, endDate, task_name) {
    const response = await fetch(`${apiUrl}/task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "task_type": "point",
            "task_name": task_name,
            "params": {
                "dates": [
                    {
                        "startDate": startDate,
                        "endDate": endDate
                    }
                ],
                "layers": [
                    {
                        "layer": "QA_LINEAGE", // Verifica el nombre exacto de la capa
                        "product": "L09.002", // Verifica este identificador
                    }
                ],
                "coordinates": [
                    {
                        "latitude": latitude,
                        "longitude": longitude
                    }
                ] // Formato correcto de coordenadas
            }
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Solicitud creada con ID:', data.task_id);
        return data.task_id;
    } else {
        console.error('Error en la solicitud:', response.status, response.statusText);
    }
}

// Función para verificar el estado de la solicitud (GET)
async function checkRequestStatus(taskId) {
    const response = await fetch(`${apiUrl}/status/${taskId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }

    });

    if (response.ok) {
        const data = await response.json();
        console.log('Estado de la solicitud:', data.status);
        return data.status;
    } else {
        console.error('Error al verificar el estado:', response.status, response.statusText);
    }
}


async function downloadCsv(urlFichero, outputFileName) {
    return new Promise((resolve, reject) => {
        axios.get(urlFichero, {
            method: 'GET',
            responseType: 'stream'
        }).then(response => {
            const filePath = path.join(__dirname, outputFileName);
            const fileStream = fs.createWriteStream(filePath);

            response.data.pipe(fileStream);

            fileStream.on('finish', () => {
                console.log(`Archivo guardado como: ${outputFileName}`);
                resolve();
            });

            fileStream.on('error', (error) => {
                console.error('Error al guardar el archivo:', error);
                reject(error);
            });
        }).catch(error => {
            console.error('Error en la solicitud:', error);
            reject(error);
        });
    });
}
// Función para descargar los datos una vez listos (GET)
async function downloadFile(taskId, fileId, fileName) {
    try {
        // Hacemos una solicitud GET al endpoint /bundle/{task_id}/{file_id}
        const response = await fetch(`${apiUrl}/bundle/${taskId}/${fileId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            redirect: 'manual' // Para manejar la redirección manualmente
        });
        const urlFichero = response.headers.get('location')
        await downloadCsv(urlFichero, fileName)
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

async function getBundleFiles(taskId) {
    const response = await fetch(`${apiUrl}/bundle/${taskId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const bundleData = await response.json();
        return bundleData.files; // Devuelve la lista de archivos
    } else {
        console.error('Error al obtener la lista de archivos:', response.status, response.statusText);
        return null;
    }
}



5
export async function getData(latitude,longitude,task_name, startDate = '10-5-2023', endDate = '10-5-2024'){
    const taskId = await requestLandsatData(latitude, longitude, startDate, endDate,task_name);
    console.log("Peticion hecha con id ",taskId)
    if (taskId) {
        console.log("Se ha creado la task")
        let status;
        do {
            status = await checkRequestStatus(taskId);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos antes de verificar nuevamente
        } while (status !== 'done');
        console.log('Taskid',taskId)
        const filelist = await getBundleFiles(taskId)
        console.log(filelist)
        console.log(filelist[0].file_id)
        await downloadFile(taskId,filelist[0].file_id,'p1.csv')
    }
}


