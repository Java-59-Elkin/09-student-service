let collection;

export function init(db) {
    collection = db.collection("college");
}

export const addStudent = async ({id, name, password}) => {
    const existing = await collection.findOne({_id: id});
    if (existing) {
        return false;
    }
    await collection.insertOne({_id: id, name, password, scores: {}});
    return true;
}

export const findStudent = async (id) => {
    return await collection.findOne({_id: id});
}

export const deleteStudent = async (id) => {
    const student = await collection.findOneAndDelete({_id: id});
    if (student) {
        return student;
    }
}

export const updateStudent = async (id, data) => {
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: data},
        {returnDocument: 'after'}
        );
}

export const addScore = async (id, exam, score) => {
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: {[`scores.${exam}`]: score}},
    )
}

export const findByName = async (name) => {
    return await collection.find({name: {$regex: `${name}`, $options: 'i'}}).toArray();
}

export const countByNames = async (names) => {
    const regexes = names.map(name => new RegExp(`^${name}$`, 'i'));
    const students = await collection.find({ name: { $in: regexes } }).toArray();

    const counts = {};
    for (const name of names) {
        const regex = new RegExp(`^${name}$`, 'i');
        counts[name] = students.filter(s => regex.test(s.name)).length;
    }
    return counts;
};

export const findByMinScore = async (exam, minScore) => {
    const query = {};
    query[`scores.${exam}`] = {$gte: minScore};
    return await collection.find(query).toArray();
}
