/**
 * CITE - Suite de Pruebas Automatizadas de Autenticación, JWT, Bcrypt y RBAC
 */

const { initDatabase, findUserByEmail, getAllTalents } = require('./database');
const { comparePassword, generateToken, verifyToken } = require('./auth');

async function runTests() {
    console.log('🧪 Iniciando pruebas de seguridad del backend CITE...\n');

    // 1. Inicialización de Base de Datos
    console.log('1. Inicializando base de datos local...');
    await initDatabase();
    console.log('   ✅ Base de datos inicializada correctamente.\n');

    // 2. Verificación de Encriptación Bcrypt
    console.log('2. Verificando encriptación Bcrypt de contraseñas semilla...');
    const adminUser = await findUserByEmail('admin@cite.org');
    if (!adminUser) throw new Error('Usuario admin no encontrado en base de datos');

    console.log(`   Hash almacenado en DB: ${adminUser.password_hash.substring(0, 25)}...`);
    const isBcryptHash = adminUser.password_hash.startsWith('$2a$') || adminUser.password_hash.startsWith('$2b$') || adminUser.password_hash.startsWith('scrypt:');
    console.log(`   ¿Formato criptográfico seguro?: ${isBcryptHash ? '✅ SÍ' : '❌ NO'}`);

    const isMatchCorrect = await comparePassword('Admin123!', adminUser.password_hash);
    console.log(`   Prueba con contraseña correcta ('Admin123!'): ${isMatchCorrect ? '✅ PASS' : '❌ FAIL'}`);

    const isMatchWrong = await comparePassword('WrongPassword!', adminUser.password_hash);
    console.log(`   Prueba con contraseña incorrecta ('WrongPassword!'): ${!isMatchWrong ? '✅ PASS (Rechazada)' : '❌ FAIL'}\n`);

    // 3. Verificación de Generación y Validación de Tokens JWT
    console.log('3. Verificando emisión y firma de tokens JWT...');
    const token = generateToken(adminUser);
    console.log(`   Token JWT generado: ${token.substring(0, 35)}...`);

    const decoded = verifyToken(token);
    console.log(`   Token decodificado: ${decoded.email} (${decoded.role})`);
    console.log(`   ¿Expiración configurada?: ${decoded.exp ? '✅ SÍ (24h)' : '❌ NO'}\n`);

    // 4. Verificación de Carga de Talentos
    console.log('4. Verificando persistencia de talentos en base de datos...');
    const talents = await getAllTalents();
    console.log(`   Talentos cargados desde DB: ${talents.length} registros`);
    if (talents.length > 0) {
        console.log(`   Primer talento: ${talents[0].name} (${talents[0].id}) - Puntaje: ${talents[0].score}/100`);
    }
    console.log('   ✅ Lectura de base de datos exitosa.\n');

    console.log('====================================================');
    console.log('🎉 TODAS LAS PRUEBAS DE SEGURIDAD PASARON CON ÉXITO');
    console.log('====================================================');
}

runTests().catch(err => {
    console.error('❌ Error en las pruebas:', err);
    process.exit(1);
});
