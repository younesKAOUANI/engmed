import React, { useState } from 'react';
import { useRouter } from 'next/router';
import FormCard from '@/components/ui/FormCard';
import Input from '@/components/ui/Input';
import { Link } from 'lucide-react';

export default function Index() {
    const router = useRouter();
    const { id } = router.query;
    const [formData, setFormData] = useState({
        title: '',
        order: '',
        courseId: id,
    });

    const [video, setVideo] = useState({
        title: '',
        duration: '',
        format: '',
        link: '',
        thumbnail: '',
    });

    const [file, setFile] = useState({
        fileName: '',
        url: '',
    });

    const [quizData, setQuizData] = useState({
        title: '',
        duration: '',
        attempts: '',
        questions: [
            {
                content: '',
                answers: ['', '', '', '', ''],
                correctAnswer: '',
                points: '',
            },
        ],
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleVideoChange = (e) => {
        const { name, value } = e.target;
        setVideo(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, value } = e.target;
        setFile(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleQuizChange = (e) => {
        const { name, value } = e.target;
        setQuizData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleQuestionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[index][name] = value;
        setQuizData(prev => ({
            ...prev,
            questions: updatedQuestions,
        }));
    };

    const handleAnswerChange = (questionIndex, answerIndex, value) => {
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[questionIndex].answers[answerIndex] = value;
        setQuizData(prev => ({
            ...prev,
            questions: updatedQuestions,
        }));
    };

    const addQuestion = () => {
        setQuizData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    content: '',
                    answers: ['', '', '', '', ''],
                    correctAnswer: '',
                    points: '',
                },
            ],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.order) newErrors.order = 'Order is required';
        if (!quizData.title) newErrors.quizTitle = 'Quiz title is required';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;
        const payload = {
            ...formData,
            video,
            file,
            quiz: {
                title: quizData.title,
                duration: quizData.duration || null,
                attempts: quizData.attempts || '3',
                questions: quizData.questions.map(question => ({
                    content: question.content,
                    answers: question.answers.filter(answer => answer.trim() !== ''),
                    correctAnswer: question.correctAnswer,
                    points: question.points || '',
                })),
            },
        };
        if (payload.courseId === undefined) {
            console.log('id unkown');
            payload.courseId = id;
            console.log('id:', payload.courseId);
        }
        console.log('Submitting form:', payload);

        try {
            const response = await fetch('/api/sequences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Sequence created:', data);
                // Handle success (e.g., redirect or show success message)
            } else {
                const errorData = await response.json();
                console.error('Failed to create sequence:', errorData);
                // Handle error (e.g., show error message)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <main className="py-6">
            <form className="grid gap-4" onSubmit={handleSubmit}>
                <FormCard title="New Sequence">
                    <div className='col-span-2'>

                        <Input
                            type="text"
                            name="title"
                            placeholder="Sequence title"
                            value={formData.title}
                            onChange={handleChange}
                            error={errors.title}
                        />
                    </div>
                    <Input
                        type="number"
                        name="order"
                        placeholder="Order"
                        value={formData.order}
                        onChange={handleChange}
                        error={errors.order}
                    />
                </FormCard>

                <FormCard title="Video Details" gridClassName="grid-cols-2">
                    <Input
                        type="text"
                        name="title"
                        placeholder="Video title"
                        value={video.title}
                        onChange={handleVideoChange}
                        error={errors.videoTitle}
                    />
                    <Input
                        type="number"
                        name="duration"
                        placeholder="Duration (seconds)"
                        value={video.duration}
                        onChange={handleVideoChange}
                        error={errors.videoDuration}
                    />
                    <Input
                        type="text"
                        name="format"
                        placeholder="Video format"
                        value={video.format}
                        onChange={handleVideoChange}
                        error={errors.videoFormat}
                    />
                    <Input
                        type="text"
                        name="link"
                        placeholder="Video link"
                        value={video.link}
                        onChange={handleVideoChange}
                        error={errors.videoLink}
                    />
                    <Input
                        type="text"
                        name="thumbnail"
                        placeholder="Thumbnail URL"
                        value={video.thumbnail}
                        onChange={handleVideoChange}
                        error={errors.videoThumbnail}
                        className="col-span-2"
                    />
                </FormCard>

                <FormCard title="File Details" gridCols={2}>
                    <Input
                        type="text"
                        name="fileName"
                        placeholder="File name"
                        value={file.fileName}
                        onChange={handleFileChange}
                        error={errors.fileName}
                    />
                    <Input
                        type="text"
                        name="url"
                        placeholder="File URL"
                        value={file.url}
                        onChange={handleFileChange}
                        error={errors.fileUrl}
                    />
                </FormCard>

                <FormCard title="Quiz">
                    <Input
                        type="text"
                        name="title"
                        placeholder="Quiz title"
                        value={quizData.title}
                        onChange={handleQuizChange}
                        error={errors.quizTitle}
                    />
                    <Input
                        type="number"
                        name="duration"
                        placeholder="Duration (minutes)"
                        value={quizData.duration}
                        onChange={handleQuizChange}
                        error={errors.duration}
                    />
                    <Input
                        type="number"
                        name="attempts"
                        placeholder="Attempts"
                        value={quizData.attempts}
                        onChange={handleQuizChange}
                        error={errors.attempts}
                    />

                    <p className='col-span-3 text-md font-bold'>Questions:</p>
                    {quizData.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="grid gap-2 border p-2 rounded">
                            <Input
                                type="text"
                                name="content"
                                placeholder={`Question #${questionIndex + 1} Content`}
                                value={question.content}
                                onChange={(e) => handleQuestionChange(questionIndex, e)}
                                error={errors[`questions[${questionIndex}].content`]}
                            />
                            {question.answers.map((answer, answerIndex) => (
                                <Input
                                    key={answerIndex}
                                    type="text"
                                    placeholder={`Answer #${answerIndex + 1}`}
                                    value={answer}
                                    onChange={(e) =>
                                        handleAnswerChange(questionIndex, answerIndex, e.target.value)
                                    }
                                    error={errors[`questions[${questionIndex}].answers[${answerIndex}]`]}
                                />
                            ))}
                            <Input
                                type="text"
                                name="correctAnswer"
                                placeholder="Correct answer"
                                value={question.correctAnswer}
                                onChange={(e) => handleQuestionChange(questionIndex, e)}
                                error={errors[`questions[${questionIndex}].correctAnswer`]}
                            />
                            <Input
                                type="number"
                                name="points"
                                placeholder="Points"
                                value={question.points}
                                onChange={(e) => handleQuestionChange(questionIndex, e)}
                                error={errors[`questions[${questionIndex}].points`]}
                            />
                        </div>
                    ))}

                    <div className="col-span-3">
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        >
                            Add Question
                        </button>
                    </div>
                </FormCard>

                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded"
                >
                    Save Sequence
                </button>
            </form>
        </main>
    );
}