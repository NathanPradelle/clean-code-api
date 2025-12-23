import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@/main/app';

describe('Cards Quiz e2e', () => {
  it('returns no due cards for today when cards have just been created', async () => {
    await request(app).post('/cards').send({
      question: 'Q1',
      answer: 'A1',
      tag: 'clean',
    });

    await request(app).post('/cards').send({
      question: 'Q2',
      answer: 'A2',
    });

    const res = await request(app).get('/cards/quizz');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  it('returns due cards at a future review date', async () => {
  await request(app).post('/cards').send({
    question: 'Q1',
    answer: 'A1',
  });

  await request(app).post('/cards').send({
    question: 'Q2',
    answer: 'A2',
  });

  const future = new Date();
  future.setDate(future.getDate() + 10);
  const dateParam = future.toISOString().slice(0, 10);

  const res = await request(app).get(`/cards/quizz?date=${dateParam}`);

  expect(res.status).toBe(200);

  const futureQuestions = res.body.map((c: any) => c.question);

  expect(futureQuestions).toContain('Q1');
  expect(futureQuestions).toContain('Q2');
  });


  it('returns 400 for invalid date format', async () => {
    const res = await request(app).get('/cards/quizz?date=not-a-date');

    expect(res.status).toBe(400);
  });
});