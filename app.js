const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // เปิดใช้งาน CORS
app.use(express.json()); // ให้ Express รองรับการรับ JSON

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/project/project', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// กำหนด Schema สำหรับ Student
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    major: String
});

const Student = mongoose.model('Student', studentSchema);

// GET: ดึงข้อมูลทั้งหมด
app.get('/project', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students); // ส่งข้อมูลทั้งหมดที่ดึงมาจาก MongoDB
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
});

// POST: เพิ่มข้อมูลนักศึกษา
app.post('/project', async (req, res) => {
    const { name, age, major } = req.body;
    const newStudent = new Student({ name, age, major });
    try {
        await newStudent.save();
        res.status(201).json({ message: 'Student added', student: newStudent });
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).json({ message: 'Failed to add student' });
    }
});

// PUT: แก้ไขข้อมูลนักศึกษา
app.put('/project/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, major } = req.body;
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            id, 
            { name, age, major }, 
            { new: true }
        );
        res.json({ message: 'Student updated', student: updatedStudent });
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).json({ message: 'Failed to update student' });
    }
});

// DELETE: ลบข้อมูลนักศึกษา
app.delete('/project/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Student.findByIdAndDelete(id);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ message: 'Failed to delete student' });
    }
});

// เริ่มต้นเซิร์ฟเวอร์ที่ port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
