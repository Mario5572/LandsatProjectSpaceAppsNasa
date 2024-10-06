import axios from "axios";

// Reemplaza 'TU_USUARIO' y 'TU_CONTRASEÑA' con tus credenciales de Earthdata
const username = 'pedro_villa';
const password = 'MakaPaka2004!';

const url = 'https://appeears.earthdatacloud.nasa.gov/api/login';

export async function obtenerToken() {
    try {
        const response = await axios.post(url, null, {
            auth: {
                username: username,
                password: password
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const tokenResponse = response.data;
        console.log('Auth succesfull')
        console.log(tokenResponse)
        return tokenResponse.token
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

