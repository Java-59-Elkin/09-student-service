import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    scores: {
        type: Map,
        key: String,
        value: Number,
        default: {}
    }
}, {
    versionKey: false
})

studentSchema.set('toJSON', {
    transform: (doc, ret) => {
        return {
            id: ret._id,
            name: ret.name,
            password: ret.password,
            scores: ret.scores
        }
    }
})

const Student = mongoose.model("Student", studentSchema, 'college');
export default Student;


// export class Student {
//     constructor(id, name, password) {
//         this.id = id;
//         this.name = name;
//         this.password = password;
//         this.scores = {};
//     }
// }