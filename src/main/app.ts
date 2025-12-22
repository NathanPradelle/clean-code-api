import cors from 'cors';
import express from 'express';

import { buildDependencies } from './composition-root';

import { createCardsController } from '@/infrastructure/http/controllers/cards.controller';
import { healthCheck } from '@/infrastructure/http/controllers/health.controller';

const app = express();

app.use(cors());
app.use(express.json());

const deps = buildDependencies();

app.get('/health', healthCheck);
app.post('/cards', createCardsController(deps.createCard));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
