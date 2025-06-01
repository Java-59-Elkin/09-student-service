// studentController.test.js
import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

jest.unstable_mockModule('../services/studentService.js', () => ({
    addStudent: jest.fn(),
    findStudent: jest.fn(),
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
    addScore: jest.fn(),
    findByName: jest.fn(),
    countByNames: jest.fn(),
    findByMinScore: jest.fn()
}));

const service = await import('../services/studentService.js');
const controller = await import('../controller/studentController.js');

const app = express();
app.use(express.json());

app.post('/student', controller.addStudent); //+
app.get('/student/:id', controller.findStudent); // +
app.patch('/student/:id', controller.updateStudent); //+
app.delete('/student/:id', controller.deleteStudent); //+
app.post('/student/:id/score', controller.addScore); // ?
app.get('/student/name/:name', controller.findByName); //+
app.get('/quantity/students', controller.countByNames); //-
app.get('/student/exam/:exam/score/:minScore', controller.findByMinScore); //+


describe('studentController', () => {
    describe('POST /student', () => {
        it('should return 201 when student is created', async () => {
            service.addStudent.mockResolvedValue(true);

            const res = await request(app).post('/student').send({ id: 1, name: 'Alice', password: '1234' });

            expect(res.statusCode).toBe(201);
        });

        it('should return 409 if student already exists', async () => {
            service.addStudent.mockResolvedValue(false);

            const res = await request(app).post('/student').send({ id: 1, name: 'Alice', password: '1234' });

            expect(res.statusCode).toBe(409);
        });

        it('should return 400 for invalid body', async () => {
            const res = await request(app).post('/student').send({ name: 'Alice' });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /student/:id', () => {
        it('should return student if found', async () => {
            service.findStudent.mockResolvedValue({ _id: 1, name: 'Alice' });

            const res = await request(app).get('/student/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ _id: 1, name: 'Alice' });
        });

        it('should return 404 if not found', async () => {
            service.findStudent.mockResolvedValue(null);

            const res = await request(app).get('/student/1');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('PATCH /student/:id', () => {
        it('should return updated student', async () => {
            service.updateStudent.mockResolvedValue({ _id: 1, name: 'Updated' });

            const res = await request(app).patch('/student/1').send({ name: 'Updated' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ _id: 1, name: 'Updated' });
        });

        it('should return 400 for invalid data', async () => {
            const res = await request(app).patch('/student/1').send({ wrong: 'field' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 404 if student not found', async () => {
            service.updateStudent.mockResolvedValue(null);

            const res = await request(app).patch('/student/1').send({ name: 'Test' });

            expect(res.statusCode).toBe(404);
        });
    });

    describe('DELETE /student/:id', () => {
        it('should return deleted student', async () => {
            service.deleteStudent.mockResolvedValue({ _id: 1, name: 'Deleted' });

            const res = await request(app).delete('/student/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ _id: 1, name: 'Deleted' });
        });

        it('should return 404 if student not found', async () => {
            service.deleteStudent.mockResolvedValue(null);

            const res = await request(app).delete('/student/1');

            expect(res.statusCode).toBe(404);
        });
    });

    describe('POST /student/:id/score', () => {
        it('should return 204 on success', async () => {
            service.addScore.mockResolvedValue(true);

            const res = await request(app).post('/student/1/score').send({ examName: 'math', score: 90 });

            expect(res.statusCode).toBe(204);
        });

        it('should return 409 on failure', async () => {
            service.addScore.mockResolvedValue(false);

            const res = await request(app).post('/student/1/score').send({ examName: 'math', score: 90 });

            expect(res.statusCode).toBe(409);
        });

        it('should return 400 for invalid score body', async () => {
            const res = await request(app).post('/student/1/score').send({ wrong: 'data' });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /student/name/:name', () => {
        it('should return students with given name', async () => {
            service.findByName.mockResolvedValue([{ _id: 1, name: 'Bob' }]);

            const res = await request(app).get('/student/name/Bob');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([{ _id: 1, name: 'Bob' }]);
        });
    });

    describe('GET /quantity/students', () => {
        it('should return name counts', async () => {
            service.countByNames.mockResolvedValue({ Bob: 2 });

            const res = await request(app)
                .get('/quantity/students')
                .query({ names: ['Bob'] });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ Bob: 2 });
        });
    });


    describe('GET /student/exam/:exam/score/:minScore', () => {
        it('should return students with score >= minScore', async () => {
            service.findByMinScore.mockResolvedValue([{ _id: 1, name: 'Eve', scores: { math: 95 } }]);

            const res = await request(app).get('/student/exam/math/score/90');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([{ _id: 1, name: 'Eve', scores: { math: 95 } }]);
        });
    });
});
