import { jest } from '@jest/globals';

// Асинхронное мокаем studentRepository.js
jest.unstable_mockModule('../repository/studentRepository.js', () => ({
    findStudentById: jest.fn(),
    createStudent: jest.fn(),
    deleteStudentById: jest.fn(),
    updateStudent: jest.fn(),
    updateStudentScore: jest.fn(),
    findStudentByName: jest.fn(),
    countStudentByNames: jest.fn(),
    findStudentsByMinScore: jest.fn(),
}));

let repo;
let service;

beforeAll(async () => {
    // Повторный импорт после моков
    repo = await import('../repository/studentRepository.js');
    service = await import('../services/studentService.js');
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('studentService', () => {
    describe('addStudent', () => {
        it('should create a student if not exists', async () => {
            repo.findStudentById.mockResolvedValue(null);
            repo.createStudent.mockResolvedValue();

            const result = await service.addStudent({ id: 1, name: 'Alice', password: 'pass123' });

            expect(repo.findStudentById).toHaveBeenCalledWith(1);
            expect(repo.createStudent).toHaveBeenCalledWith({ _id: 1, name: 'Alice', password: 'pass123' });
            expect(result).toBe(true);
        });

        it('should not create a student if already exists', async () => {
            repo.findStudentById.mockResolvedValue({ _id: 1, name: 'Alice' });

            const result = await service.addStudent({ id: 1, name: 'Alice', password: 'pass123' });

            expect(repo.findStudentById).toHaveBeenCalledWith(1);
            expect(repo.createStudent).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });

    describe('findStudent', () => {
        it('should return student without password', async () => {
            repo.findStudentById.mockResolvedValue({ _id: 1, name: 'Alice', password: 'hidden' });

            const result = await service.findStudent(1);

            expect(result).toEqual({ _id: 1, name: 'Alice', password: undefined });
        });

        it('should return null if student not found', async () => {
            repo.findStudentById.mockResolvedValue(null);

            const result = await service.findStudent(1);

            expect(result).toBeNull();
        });
    });

    describe('updateStudent', () => {
        it('should return updated student without scores', async () => {
            repo.updateStudent.mockResolvedValue({ _id: 1, name: 'Bob', scores: { math: 90 } });

            const result = await service.updateStudent(1, { name: 'Bob' });

            expect(result).toEqual({ _id: 1, name: 'Bob', scores: undefined });
        });
    });

    describe('deleteStudent', () => {
        it('should return deleted student without password', async () => {
            repo.deleteStudentById.mockResolvedValue({ _id: 2, name: 'Carl', password: 'xxx' });

            const result = await service.deleteStudent(2);

            expect(result).toEqual({ _id: 2, name: 'Carl', password: undefined });
        });
    });

    describe('addScore', () => {
        it('should call updateStudentScore', async () => {
            repo.updateStudentScore.mockResolvedValue({ success: true });

            const result = await service.addScore(1, 'math', 95);

            expect(repo.updateStudentScore).toHaveBeenCalledWith(1, 'math', 95);
            expect(result).toEqual({ success: true });
        });
    });

    describe('findByName', () => {
        it('should return students without passwords', async () => {
            repo.findStudentByName.mockResolvedValue([
                { _id: 1, name: 'Dan', password: '1234' },
                { _id: 2, name: 'Dana', password: '4321' },
            ]);

            const result = await service.findByName('Dan');

            expect(result).toEqual([
                { _id: 1, name: 'Dan', password: undefined },
                { _id: 2, name: 'Dana', password: undefined },
            ]);
        });
    });

    describe('countByNames', () => {
        it('should return count from repository', async () => {
            repo.countStudentByNames.mockResolvedValue({ Dan: 2 });

            const result = await service.countByNames(['Dan']);

            expect(repo.countStudentByNames).toHaveBeenCalledWith(['Dan']);
            expect(result).toEqual({ Dan: 2 });
        });
    });

    describe('findByMinScore', () => {
        it('should return students without passwords', async () => {
            repo.findStudentsByMinScore.mockResolvedValue([
                { _id: 3, name: 'Eve', password: 'hidden', scores: { math: 100 } }
            ]);

            const result = await service.findByMinScore('math', 90);

            expect(result).toEqual([
                { _id: 3, name: 'Eve', password: undefined, scores: { math: 100 } }
            ]);
        });
    });
});
