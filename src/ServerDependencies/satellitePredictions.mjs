import * as satellite from 'satellite.js';
import axios from 'axios';

let tleLine1 = '1 39084U 13008A   23278.50347222  .00000023  00000+0  12593-4 0  9998';
let tleLine2 = '2 39084  98.2125 331.5434 0001586  97.9483 262.1866 14.57113563583319';
let satrec = satellite.twoline2satrec(tleLine1, tleLine2);

setInterval(() => {
    console.log("Fetching from celestrak a new TLE")
    fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=49260&FORMAT=tle')
    .then((res) => {
        res.text()
        .then((r) => {
            const lines = r.split('\n')
            tleLine1 = lines[1].replace(/\r/g, '')
            tleLine2 = lines[2].replace(/\r/g, '')
            console.log(tleLine1)
            satrec = satellite.twoline2satrec(tleLine1, tleLine2);
        })
    })
}, 1000 * 3600 * 6 ); // cada 6 horas


export function coordinatesOfDate(date){
    const gmst = satellite.gstime(date);
    const positionAndVelocity = satellite.propagate(satrec, date);
    const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst)
    const latitude = satellite.degreesLat(positionGd.latitude);
    const longitude = satellite.degreesLong(positionGd.longitude);
    const altitude = positionGd.height; // Altitud en kilómetros
    return {
        latitude,
        longitude,
        altitude
    }
}

//Funcion para calcular la distancia de dos lugares dados por longitud y latitud
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en kilómetros
}

export function predictSatellitePass(targetLatitude, targetLongitude) {
    let currentTime = new Date();
    const timeStep = 60; // Incremento de tiempo en segundos (1 minuto)
    let closestPass = null;
    let minDistance = Infinity;

    while (!closestPass) {
        // Propagar la órbita para el tiempo actual
        const positionAndVelocity = satellite.propagate(satrec, currentTime);
        
        if (positionAndVelocity.position) {
            const pos = coordinatesOfDate(currentTime)
            // Calcular la distancia a la ubicación objetivo
            const distance = calculateDistance(pos.latitude, pos.longitude, targetLatitude, targetLongitude);
            // Si la distancia es menor a 50 km, consideramos que el satélite está "pasando" por encima
            if (distance < 50) {
                closestPass = currentTime;
            } else {
                // Verificar si esta es la distancia más corta encontrada hasta ahora
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
        // Incrementar el tiempo en el intervalo definido
        currentTime = new Date(currentTime.getTime() + timeStep * 1000);
    }
    return closestPass;
}
