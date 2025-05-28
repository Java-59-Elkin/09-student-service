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