import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración del Test de Performance K6 Contalink
export let options = {
    scenarios: {
        performance_test: {
            executor: 'constant-arrival-rate',
            rate: 20,
            timeUnit: '1s',
            duration: '30s',
            preAllocatedVUs: 50,
            maxVUs: 100,
        },
    },
};

// Endpoints a validar en la prueba de Performance
const endpoints = [
    {
        method: 'GET',
        url: 'https://candidates-api.contalink.com/V1/invoices/',
        headers: {
            'Authorization': '${__ENV.API_TOKEN}',
            'Content-Type': 'application/json'
        },
        payload: null // GET No RequestBody
    },
    
    // {
    //     method: 'POST',
    //     url: 'https://api.ejemplo.com/otro-endpoint/',
    //     headers: { 'Authorization': 'Bearer TU_TOKEN', 'Content-Type': 'application/json' },
    //     payload: { id: 123, nombre: "Ejemplo" }
    // }
];

export default function () {
    endpoints.forEach(ep => {
        let res;

        if (ep.method === 'GET') {
            res = http.get(ep.url, { headers: ep.headers });
        } else if (ep.method === 'POST') {
            res = http.post(ep.url, JSON.stringify(ep.payload), { headers: ep.headers });
        }

        // StatusCode
        check(res, {
            "status 200": r => r.status === 200,
            "status 400": r => r.status === 400,
            "status 401": r => r.status === 401,
            "status 429": r => r.status === 429,
            "status 500": r => r.status === 500,
            "respuesta no vacía": r => r.body.length > 0
        });

        // Log Debugging
        if (![200, 400, 401, 429, 500].includes(res.status)) {
            console.log(`Request inesperada: ${res.status} -> ${ep.url}`);
        }

        sleep(1);
    });
}