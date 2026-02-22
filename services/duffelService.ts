import { Flight, Accommodation } from '../types';

interface FlightSearchParams {
    origin: string;
    destination: string;
    departureDate: string; // YYYY-MM-DD
    returnDate?: string;   // YYYY-MM-DD
    adults: number;
}

interface AccommodationSearchParams {
    location: string;
    checkInDate: string;   // YYYY-MM-DD
    checkOutDate: string;  // YYYY-MM-DD
    adults: number;
}

/**
 * Llama al proxy de Duffel para buscar ofertas de vuelos.
 */
export async function searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    try {
        const response = await fetch('/api/duffel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'searchFlights',
                params
            })
        });

        if (!response.ok) {
            console.error('Error from Duffel proxy:', await response.text());
            return [];
        }

        const data = await response.json();

        if (!data.offers || !Array.isArray(data.offers)) {
            return [];
        }

        // Mapear la respuesta de Duffel al tipo Flight de la aplicación
        return data.offers.map((offer: any) => {
            const outSlices = offer.slices[0]; // Viaje de ida
            const firstSegment = outSlices.segments[0];
            const lastSegment = outSlices.segments[outSlices.segments.length - 1];

            return {
                id: offer.id,
                origin: firstSegment.origin.iata_code,
                destination: lastSegment.destination.iata_code,
                departureTime: firstSegment.departing_at,
                arrivalTime: lastSegment.arriving_at,
                airline: offer.owner.name,
                flightNumber: `${firstSegment.operating_carrier.iata_code}${firstSegment.operating_carrier_flight_number}`,
                price: Number(offer.total_amount),
                bookingUrl: undefined // Duffel requiere crear la orden mediante API, no provee URL directa en pruebas
            } as Flight;
        });

    } catch (error) {
        console.error('Failed to search flights with Duffel:', error);
        return [];
    }
}

/**
 * Llama al proxy de Duffel para buscar alojamientos (cuando esté disponible).
 * Por ahora devuelve un array vacío o datos mockeados si es necesario.
 */
export async function searchAccommodations(params: AccommodationSearchParams): Promise<Accommodation[]> {
    try {
        const response = await fetch('/api/duffel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'searchAccommodations',
                params
            })
        });

        // Como `searchAccommodations` aún no está implementado al 100% en Duffel Test, devolvemos vacío
        // En un futuro aquí parsearemos los resultados reales
        return [];
    } catch (error) {
        console.error('Failed to search accommodations with Duffel:', error);
        return [];
    }
}
