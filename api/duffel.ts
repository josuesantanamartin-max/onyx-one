import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Duffel } from '@duffel/api';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Responder a preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { action, params } = req.body;

        if (!action) {
            return res.status(400).json({ error: 'Missing action parameter' });
        }

        const accessToken = process.env.VITE_DUFFEL_ACCESS_TOKEN?.trim();

        if (!accessToken || accessToken === 'your_duffel_access_token') {
            return res.status(500).json({ error: 'Duffel API key not configured properly' });
        }

        const duffel = new Duffel({
            token: accessToken,
        });

        // Enrutar la petición según la 'action'
        switch (action) {
            case 'searchFlights': {
                const { origin, destination, departureDate, returnDate, adults } = params;

                // Formatear pasajeros para Duffel
                const passengers = Array(Number(adults) || 1).fill({ type: 'adult' });

                const slices = [
                    { origin, destination, departure_date: departureDate }
                ];

                // Si hay fecha de retorno, añadimos el viaje de vuelta
                if (returnDate) {
                    slices.push({ origin: destination, destination: origin, departure_date: returnDate });
                }

                // 1. Crear Offer Request
                const offerRequest = await duffel.offerRequests.create({
                    slices,
                    passengers,
                    return_offers: true, // Queremos que nos devuelva las ofertas directamente
                });

                // Top 5 ofertas más baratas
                const topOffers = offerRequest.data.offers
                    .sort((a, b) => Number(a.total_amount) - Number(b.total_amount))
                    .slice(0, 5);

                return res.status(200).json({ offers: topOffers });
            }

            case 'searchAccommodations': {
                // TODO: Duffel Stays (Alojamiento) está actualmente en Beta privada para algunos usuarios.
                // Confirmaremos más adelante si el token de prueba permite realizar búsquedas de hoteles,
                // de lo contrario podemos mockear esto temporalmente o usar otra API para alojamientos.
                return res.status(200).json({ message: 'Accommodation search not fully implemented yet' });
            }

            default:
                return res.status(400).json({ error: `Unknown action: ${action}` });
        }
    } catch (error: any) {
        console.error('Duffel Proxy Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
