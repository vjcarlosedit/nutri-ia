import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database';
import authRoutes from './routes/auth';
import evaluationsRoutes from './routes/evaluations';
import mealPlansRoutes from './routes/meal-plans';
import monitoringRoutes from './routes/monitoring';
import { authenticate, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar servidor después de que la base de datos esté lista
async function startServer() {
  try {
    await initDatabase();
    console.log('✅ Base de datos lista');
    
    // Rutas públicas
    app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/meal-plans', mealPlansRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nutri-IA API está funcionando' });
});

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 API disponible en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

