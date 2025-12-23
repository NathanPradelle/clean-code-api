import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '@/main/app';

describe('Cards HTTP API', () => {
  it('creates a card and lists it with correct Swagger shape and category', async () => {
    const createResponse = await request(app)
      .post('/cards')
      .send({
        question: 'What is pair programming ?',
        answer: 'Two people working on the same code.',
        tag: 'Teamwork',
      })
      .expect(201);

    const createdCard = createResponse.body;

    expect(createdCard).toHaveProperty('id');
    expect(createdCard).toHaveProperty('question', 'What is pair programming ?');
    expect(createdCard).toHaveProperty('answer', 'Two people working on the same code.');
    expect(createdCard).toHaveProperty('tag', 'Teamwork');
    expect(createdCard).toHaveProperty('category', 'FIRST');

    const listResponse = await request(app).get('/cards').expect(200);
    const cards = listResponse.body as unknown[];

    expect(Array.isArray(cards)).toBe(true);

    const found = cards.find(
      (c: any) =>
        c.id === createdCard.id &&
        c.question === createdCard.question &&
        c.answer === createdCard.answer &&
        c.tag === createdCard.tag,
    ) as any;

    expect(found).toBeDefined();
    expect(found.category).toBe('FIRST');

    const filteredResponse = await request(app)
      .get('/cards')
      .query({ tags: 'Teamwork' })
      .expect(200);

    const filteredCards = filteredResponse.body as unknown[];

    expect(Array.isArray(filteredCards)).toBe(true);

    const filteredFound = filteredCards.find((c: any) => c.id === createdCard.id) as any;

    expect(filteredFound).toBeDefined();
    expect(filteredFound.tag).toBe('Teamwork');
    expect(filteredFound.category).toBe('FIRST');
  });

  it('returns 400 when creating a card with invalid body', async () => {
    await request(app)
      .post('/cards')
      .send({
        answer: 'Missing question',
      })
      .expect(400);

    await request(app)
      .post('/cards')
      .send({
        question: 'Missing answer',
      })
      .expect(400);

    await request(app)
      .post('/cards')
      .send({
        question: 'Q',
        answer: 'A',
        tag: 123,
      })
      .expect(400);
  });
});

describe('Answer card e2e', () => {

  it('accepts a valid answer and returns 204', async () => {
    const createRes = await request(app).post('/cards').send({
      question: 'Q',
      answer: 'A',
    });

    const cardId = createRes.body.id;

    const res = await request(app)
      .patch(`/cards/${cardId}/answer`)
      .send({ isValid: true });

    expect(res.status).toBe(204);
  });

  it('returns 404 when answering an unknown card', async () => {
    const res = await request(app)
      .patch('/cards/unknown-id/answer')
      .send({ isValid: true });

    expect(res.status).toBe(404);
  });

  it('returns 400 when isValid is missing', async () => {
    const createRes = await request(app).post('/cards').send({
      question: 'Q',
      answer: 'A',
    });

    const cardId = createRes.body.id;

    const res = await request(app)
      .patch(`/cards/${cardId}/answer`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('resets box level to 1 when answer is wrong', async () => {
    const createRes = await request(app).post('/cards').send({
      question: 'Q',
      answer: 'A',
    });

    const cardId = createRes.body.id;

    await request(app)
      .patch(`/cards/${cardId}/answer`)
      .send({ isValid: true });

    await request(app)
      .patch(`/cards/${cardId}/answer`)
      .send({ isValid: false });

    const res = await request(app).get('/cards');

    expect(res.body[0].category).toBe('FIRST');
  });
});
