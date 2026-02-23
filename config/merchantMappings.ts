export interface MerchantMapping {
    keywords: string[];
    category: string;
    subCategory?: string;
}

// Diccionario extendido de comercios comunes en España/Latam para auto-categorización
export const MERCHANT_MAPPINGS: MerchantMapping[] = [
    // ALIMENTACIÓN SUPERMERCADOS
    {
        keywords: ['MERCADONA', 'CARREFOUR', 'LIDL', 'ALDI', 'DIA ', 'DIA%', 'AHORRAMAS', 'CONSUM', 'EROSKI', 'SUPERCOR', 'HIPERCOR', 'ALCAMPO', 'CAPRABO', 'MAKRO', 'BONPREU', 'CONDIS', 'FROIZ', 'GADIS', 'COVIRAN', 'MASYMAS', 'LUPA', 'BM SUPERMERCADOS', 'ALIMERKA', 'PRYCA', 'CONTINENTE', 'SPAR'],
        category: 'Alimentación',
        subCategory: 'Supermercados'
    },
    {
        keywords: ['PANADERIA', 'FRUTERIA', 'CARNICERIA', 'PESCADERIA', 'CHARCUTERIA', 'PASTELERIA', 'VERDULERIA'],
        category: 'Alimentación',
        subCategory: 'Comercio Local'
    },

    // RESTAURACIÓN Y DELIVERY
    {
        keywords: ['RESTAURANTE', 'BAR ', 'CAFETERIA', 'MC DONALD', 'MCDONALDS', 'BURGER KING', 'KFC', 'STARBUCKS', 'GLOVO', 'JUST EAT', 'UBER EATS', 'DELIVEROO', 'TELEPIZZA', 'DOMINOS', '100 MONTADITOS', 'LIZARRAN', 'FOSTER', 'VIPS', 'GINOS', 'TAGLIATELLA', 'GOIKO', 'FIVE GUYS', 'POPEYES', 'SUBWAY', 'TGB', 'THE GOOD BURGER', 'TACO BELL', 'RODILLA', 'SMASH', 'PAPA JOHNS', 'CASA TARRADELLAS'],
        category: 'Comida y Bebida',
        subCategory: 'Restaurantes'
    },

    // TRANSPORTE Y COMBUSTIBLE
    {
        keywords: ['REPSOL', 'CEPSA', 'BP ', 'SHELL', 'GASOLINERA', 'ESTACION SERV', 'GALP', 'PETROL', 'BALLENOIL', 'PLENOIL', 'PETRONOR', 'AVIA', 'CAMPSA', 'MEROIL'],
        category: 'Transporte',
        subCategory: 'Gasolina'
    },
    {
        keywords: ['RENFE', 'METRO', 'ALSA', 'AVANZA', 'EMT', 'TMB', 'CERCANIAS', 'TRANVIA', 'AUTOBUS', 'BONOTREN', 'ABONO TRANSPORTE', 'CABIFY', 'UBER', 'FREENOW', 'TAXI', 'BOLT'],
        category: 'Transporte',
        subCategory: 'Transporte Público'
    },
    {
        keywords: ['RYANAIR', 'IBERIA', 'VUELING', 'AIR EUROPA', 'EASYJET', 'LUFTHANSA', 'BINTER', 'VOLOTEA'],
        category: 'Transporte',
        subCategory: 'Vuelos'
    },
    {
        keywords: ['PARQUIMETRO', 'PARKING', 'APARCAMIENTO', 'TELPARK', 'ELPARKING', 'EYSA', 'ZONA AZUL', 'ORA', 'PEAJE', 'AUTPISTA', 'BIP&DRIVE', 'VIA T'],
        category: 'Transporte',
        subCategory: 'Parking y Peajes'
    },

    // HOGAR Y SUMINISTROS
    {
        keywords: ['IKEA', 'LEROY MERLIN', 'BAUHAUS', 'CONFORAMA', 'ZARA HOME', 'H&M HOME', 'TIGER', 'CASA', 'BRICOMART', 'OBRAMAT', 'BRICODEPOT'],
        category: 'Vivienda',
        subCategory: 'Mobiliario'
    },
    {
        keywords: ['ENDESA', 'IBERDROLA', 'NATURGY', 'REPSOL LUZ', 'EDP', 'HOLALUZ', 'CURENERGIA', 'SOM ENERGIA', 'LUCERA', 'ENERGIA'],
        category: 'Vivienda',
        subCategory: 'Electricidad'
    },
    {
        keywords: ['CANAL ISABEL', 'AGUAS', 'AQUALIA', 'AGBAR'],
        category: 'Vivienda',
        subCategory: 'Agua'
    },
    {
        keywords: ['TELEFONICA', 'MOVISTAR', 'ORANGE', 'VODAFONE', 'YOIGO', 'PEPEPHONE', 'SIMYO', 'LOWI', 'O2', 'DIGI', 'JAZZTEL', 'MASMOVIL', 'AMENA'],
        category: 'Vivienda',
        subCategory: 'Internet y Teléfono'
    },

    // SALUD Y BELLEZA
    {
        keywords: ['FARMACIA', 'OPTICA', 'DENTAL', 'FISIO', 'HOSPITAL', 'CLINICA', 'SANITAS', 'ADESLAS', 'MAPFRE SALUD', 'ASISA', 'DKV', 'CENTRO MEDICO', 'PSIQUIATRA', 'PSICOLOGO', 'PODOLOGO', 'DERMATOLOGO', 'VISION'],
        category: 'Salud',
        subCategory: 'Médico'
    },
    {
        keywords: ['PELUQUERIA', 'BARBERIA', 'ESTETICA', 'DEPILACION', 'DRUNI', 'PRIMOR', 'SEPHORA', 'DOUGLAS', 'KIKO MILANO', 'MERCADONA PERFUMERIA', 'MAC COSMETICS'],
        category: 'Salud',
        subCategory: 'Belleza'
    },

    // OCIO Y SUSCRIPCIONES
    {
        keywords: ['NETFLIX', 'SPOTIFY', 'DISNEY PLUS', 'DISNEY+', 'AMAZON PRIME', 'PRIME VIDEO', 'HBO', 'MAX', 'APPLE.COM/BILL', 'GOOGLE *', 'PLAYSTATION', 'NINTENDO', 'STEAM', 'EPIC GAMES', 'XBOX', 'TWITCH', 'YOUTUBE PREMIUM', 'DAZN', 'FILMIN', 'MOVISTAR PLUS', 'ATRESPLAYER', 'MITELE'],
        category: 'Ocio',
        subCategory: 'Suscripciones'
    },
    {
        keywords: ['CINE', 'YELMO', 'CINESA', 'KINEPOLIS', 'TEATRO', 'CONCIERTO', 'TICKETMASTER', 'ENTRADAS.COM', 'MUSEO', 'EXPOSICION', 'ESTADIO', 'FUTBOL'],
        category: 'Ocio',
        subCategory: 'Entretenimiento'
    },
    {
        keywords: ['GIMNASIO', 'GYM', 'BASIC FIT', 'MCFIT', 'ALTAFIT', 'VIVAGYM', 'GO FIT', 'BIDI', 'CROSSFIT', 'PISCINA', 'POLIDEPORTIVO'],
        category: 'Ocio',
        subCategory: 'Deporte'
    },

    // COMPRAS GENERALES
    {
        keywords: ['EL CORTE INGLES', 'AMAZON', 'ALIEXPRESS', 'TEMU', 'SHEIN', 'MIRAVIA'],
        category: 'Compras',
        subCategory: 'General'
    },
    {
        keywords: ['ZARA', 'H&M', 'MANGO', 'ULL & BEAR', 'STRADIVARIUS', 'BERSHKA', 'MASSIMO DUTTI', 'OYSHO', 'SPRINGFIELD', 'PRIMARK', 'DECATHLON', 'NIKE', 'ADIDAS', 'ZALANDO', 'ASOS', 'CORTEFIEL', 'PEDRO DEL HIERRO', 'BIMBA Y LOLA', 'WOMEN SECRET', 'SCALPERS'],
        category: 'Compras',
        subCategory: 'Ropa y Calzado'
    },
    {
        keywords: ['MEDIA MARKT', 'WORTEN', 'PC COMPONENTES', 'APPLE STORE', 'K-TUIN', 'FNAC', 'GAME'],
        category: 'Compras',
        subCategory: 'Electrónica'
    },

    // EDUCACIÓN
    {
        keywords: ['COLEGIO', 'UNIVERSIDAD', 'CURSO', 'ACADEMIA', 'UDEMY', 'COURSERA', 'PLATZI', 'DOMESTIKA', 'EDX', 'ESCUELA', 'GUARDERIA', 'INSTITUTO', 'MATRICULA', 'MASTER', 'LIBRERIA', 'PAPELERIA', 'CASA DEL LIBRO'],
        category: 'Educación'
    },

    // GASTOS FINANCIEROS Y SEGUROS
    {
        keywords: ['MAPFRE', 'MUTUA', 'LINEA DIRECTA', 'ALLIANZ', 'AXA', 'ZURICH', 'PELAYO', 'GENESIS', 'VERTI', 'QUALITAS', 'SEGURO'],
        category: 'Educación', // Should map to Seguros ideally, but we stick to existing generic categories or create one
        subCategory: 'Seguros'
    },
    {
        keywords: ['COMISION', 'MANTENIMIENTO', 'INTERESES', 'CUOTA TARJETA', 'RECARGO', 'DESCUBIERTO'],
        category: 'Impuestos y Tasas',
        subCategory: 'Comisiones Bancarias'
    },
    {
        keywords: ['AEAT', 'AGENCIA TRIBUTARIA', 'SEGURIDAD SOCIAL', 'IBI', 'AYUNTAMIENTO', 'IMPUESTO', 'TASA', 'MULTA', 'DGT'],
        category: 'Impuestos y Tasas',
        subCategory: 'Impuestos'
    },

    // TRANSFERENCIAS Y CAJEROS
    {
        keywords: ['BIZUM', 'TRANSFERENCIA A', 'TRASPASO', 'ENVIO', 'PAYPAL'],
        category: 'Transferencias',
        subCategory: 'Enviadas'
    },
    {
        keywords: ['CAJERO', 'RETIRADA EFECTIVO', 'DISPOSICION EFECTIVO', 'ATM'],
        category: 'Transferencias',
        subCategory: 'Efectivo'
    }
];
