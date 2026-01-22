import { z } from 'zod';

/**
 * Flight schema
 */
const flightSchema = z.object({
    id: z.string().optional(),
    origin: z.string().min(1, 'Origin is required'),
    destination: z.string().min(1, 'Destination is required'),
    departureTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, 'Invalid departure time format'),
    arrivalTime: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, 'Invalid arrival time format'),
    airline: z.string().min(1, 'Airline is required'),
    flightNumber: z.string().min(1, 'Flight number is required'),
    price: z.number().nonnegative('Price must be non-negative'),
    bookingUrl: z.string().url('Booking URL must be valid').optional(),
});

/**
 * Accommodation schema
 */
const accommodationSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Accommodation name is required'),
    address: z.string().min(1, 'Address is required'),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-in date must be in YYYY-MM-DD format'),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-out date must be in YYYY-MM-DD format'),
    price: z.number().nonnegative('Price must be non-negative'),
    bookingUrl: z.string().url('Booking URL must be valid').optional(),
});

/**
 * Itinerary item schema
 */
const itineraryItemSchema = z.object({
    id: z.string().optional(),
    time: z.string().min(1, 'Time is required'),
    activity: z.string().min(1, 'Activity is required').max(200, 'Activity must be less than 200 characters'),
    location: z.string().optional(),
    type: z.enum(['ACTIVITY', 'FOOD', 'TRANSPORT'], {
        errorMap: () => ({ message: 'Invalid itinerary item type' }),
    }),
});

/**
 * Trip validation schema
 */
export const tripSchema = z
    .object({
        id: z.string().optional(),
        destination: z
            .string({
                required_error: 'Destination is required',
            })
            .min(1, 'Destination cannot be empty')
            .max(100, 'Destination must be less than 100 characters'),
        country: z
            .string({
                required_error: 'Country is required',
            })
            .min(1, 'Country cannot be empty')
            .max(100, 'Country must be less than 100 characters'),
        startDate: z
            .string({
                required_error: 'Start date is required',
            })
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
        endDate: z
            .string({
                required_error: 'End date is required',
            })
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
        budget: z
            .number({
                required_error: 'Budget is required',
                invalid_type_error: 'Budget must be a number',
            })
            .positive('Budget must be greater than 0')
            .finite('Budget must be a valid number'),
        spent: z
            .number()
            .nonnegative('Spent amount must be non-negative')
            .optional()
            .default(0),
        status: z
            .enum(['UPCOMING', 'CURRENT', 'COMPLETED'], {
                errorMap: () => ({ message: 'Invalid trip status' }),
            })
            .optional()
            .default('UPCOMING'),
        image: z.string().url('Image must be a valid URL').optional().default(''),
        flights: z.array(flightSchema).optional().default([]),
        accommodations: z.array(accommodationSchema).optional().default([]),
        itinerary: z.array(itineraryItemSchema).optional().default([]),
        linkedGoalId: z.string().optional(),
    })
    .refine(
        (data) => {
            // End date must be after start date
            return new Date(data.endDate) > new Date(data.startDate);
        },
        {
            message: 'End date must be after start date',
            path: ['endDate'],
        }
    )
    .refine(
        (data) => {
            // Spent cannot exceed budget
            return data.spent <= data.budget;
        },
        {
            message: 'Spent amount cannot exceed budget',
            path: ['spent'],
        }
    );

/**
 * Validate trip data
 */
export function validateTrip(data: unknown) {
    return tripSchema.safeParse(data);
}

/**
 * Type inference from schema
 */
export type TripInput = z.infer<typeof tripSchema>;
