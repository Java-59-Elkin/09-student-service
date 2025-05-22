import * as repo from '../repository/studentRepository.js';

export const addStudent = (req, res) => {
    const success = repo.addStudent(req.body);
    if (success) {
        res.status(204).send();
    } else {
        res.status(409).send();
    }
}

export const findStudent = (req, res) => {
    const student = repo.findStudent(+req.params.id);
    if (student) {
        const tmp = {...student};
        delete tmp.password;
        res.json(tmp);
    } else {
        res.status(404).send();
    }
}

export const updateStudent = (req, res) => {
    const student = repo.updateStudent(+req.params.id, req.body);
    if (student) {
        const tmp = {...student};
        delete tmp.scores;
        res.json(tmp);
    } else {
        res.status(404).send();
    }
}

export const deleteStudent = (req, res) => {
    const student = repo.deleteStudent(+req.params.id);
    if (student) {
        delete student.password;
        res.json(student);
    } else {
        res.status(404).send();
    }
}

export const addScore = (req, res) => {
    const success = repo.addScore(+req.params.id, req.body.examName, +req.body.score);
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
}

export const findByName = (req, res) => {
    const students = repo.findByName(req.params.name);
    res.json(students);
}

export const countByNames = (req, res) => {
    const names = req.query.names;
    const list = Array.isArray(names) ? names : [names];
    const count = repo.countByNames(list);
    res.json(count)
}

export const findByMinScore = (req, res) => {
    const students = repo.findByMinScore(req.params.exam, +req.params.minScore);
    res.json(students);
}