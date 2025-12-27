import cors from 'cors';
import express from 'express';

import { createDeps } from './composition-root';

import {
  answerCardController,
  createCardsController,
  getCardsController,
  getQuizzCardsController,
} from '@/infrastructure/http/controllers/cards.controller';
import { healthCheck } from '@/infrastructure/http/controllers/health.controller';


const app = express();

// ============================================
// MIDDLEWARES
// ============================================

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

// ============================================
// INJECTION DE DÉPENDANCES
// ============================================

const deps = createDeps();

// ============================================
// ROUTES - CONFORME AU CONTRAT OPENAPI
// ============================================

app.get('/health', healthCheck);

app.get('/cards', getCardsController(deps.listOwnerCards));
app.post('/cards', createCardsController(deps.createCard));

app.get('/cards/quizz', getQuizzCardsController(deps.getQuizCards));

app.patch('/cards/:cardId/answer', answerCardController(deps.answerCard));

// ============================================
// 404 - ROUTE NON TROUVÉE
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl,
  });
});

// ============================================
// ERROR HANDLER GLOBAL
// ============================================
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur serveur interne',
    message: err.message,
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
const PORT = 8080; // ✅ Port 8080 comme dans OpenAPI

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🚀 API LEITNER DÉMARRÉE !           ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║   📍 URL: http://localhost:${PORT}       ║`);
  console.log('║   🗄️  Base: MySQL (leitner_db)        ║');
  console.log('║   🏗️  Architecture: Hexagonale        ║');
  console.log('║   📄 Conforme: OpenAPI 3.0.3          ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log('📚 Endpoints (OpenAPI):');
  console.log('   GET    /health');
  console.log('   GET    /cards');
  console.log('   POST   /cards');
  console.log('   GET    /cards/quizz');
  console.log('   PATCH  /cards/:cardId/answer');
  console.log('');
});

export default app;