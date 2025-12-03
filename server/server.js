import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import evaluationsRoutes from './routes/evaluations.js';
import mealPlansRoutes from './routes/mealPlans.js';
import monitoringRoutes from './routes/monitoring.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nutri-IA Backend está funcionando' });
});

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/meal-plans', mealPlansRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Ruta protegida para verificar token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ message: 'Token válido', user: req.user });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

