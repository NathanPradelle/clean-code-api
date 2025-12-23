import cors from 'cors';
import express from 'express';

import { createDeps } from './composition-root';

import {
  createCardsController,
  getCardsController,
} from '@/infrastructure/http/controllers/cards.controller';
import { healthCheck } from '@/infrastructure/http/controllers/health.controller';

export const app = express();

app.use(cors());
app.use(express.json());

const deps = createDeps();

app.get('/health', healthCheck);
app.post('/cards', createCardsController(deps.createCard));
app.get('/cards', getCardsController(deps.listOwnerCards));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
