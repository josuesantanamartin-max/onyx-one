// Script para ejecutar migración de Supabase
// Ejecutar con: node run-migration.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yxmoinjqynqspqgdimst.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bW9pbmpxeW5xc3BxZ2RpbXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMzc3MDcsImV4cCI6MjA4MzgxMzcwN30.sGdKSwHLjxg25_2UtqR-FQYPnkRx0qUDJuLyYZyddk4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('🚀 Iniciando migración de Supabase...\n');

    try {
        // Leer archivo SQL
        const sqlPath = join(__dirname, 'supabase_migrations', 'user_dashboard_layouts.sql');
        const sqlContent = readFileSync(sqlPath, 'utf-8');

        console.log('📄 Archivo SQL cargado correctamente');
        console.log('📊 Ejecutando migración...\n');

        // Nota: Supabase client no permite ejecutar SQL directamente por seguridad
        // Necesitamos usar la API REST o el dashboard de Supabase
        console.log('⚠️  IMPORTANTE: La migración SQL debe ejecutarse manualmente en Supabase Dashboard');
        console.log('\n📋 Pasos para ejecutar la migración:');
        console.log('1. Ve a: https://supabase.com/dashboard/project/yxmoinjqynqspqgdimst/editor');
        console.log('2. Haz clic en "SQL Editor" en el menú lateral');
        console.log('3. Crea una nueva query');
        console.log('4. Copia y pega el contenido del archivo:');
        console.log('   supabase_migrations/user_dashboard_layouts.sql');
        console.log('5. Ejecuta la query con "Run" o Ctrl+Enter\n');

        console.log('📝 Contenido de la migración:');
        console.log('─'.repeat(60));
        console.log(sqlContent);
        console.log('─'.repeat(60));

        // Verificar si la tabla ya existe
        console.log('\n🔍 Verificando si la tabla ya existe...');
        const { data, error } = await supabase
            .from('user_dashboard_layouts')
            .select('count')
            .limit(1);

        if (error) {
            if (error.code === '42P01') {
                console.log('❌ La tabla NO existe. Ejecuta la migración manualmente.');
            } else {
                console.log('❌ Error al verificar tabla:', error.message);
            }
        } else {
            console.log('✅ La tabla YA EXISTE en Supabase!');
            console.log('✨ Migración completada previamente o ejecutada exitosamente.');
        }

    } catch (error) {
        console.error('❌ Error al ejecutar migración:', error);
        process.exit(1);
    }
}

runMigration();
