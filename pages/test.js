import React from 'react'
import axios from 'axios';

export default function test() {


    async function addCourse() {
        const courseData = {
            title: 'Example Course',
            description: 'This is a description.',
            price: 1000,
            thumbnail: 'https://example.com/image.jpg',
        };

        try {
            console.log('Adding course...', courseData);
            const response = await axios.post('/api/courses', courseData, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Course added:', response.data);
        } catch (error) {
            console.error('Error adding course:', error);
        }
    }

    return (
        <div>
            <button onClick={addCourse}>Add Course</button>
        </div>
    )
}
