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
    questions: [{ content: '', answers: ['', '', '', ''], correctAnswer: '', points: '' }],
  });

  const [speechQuizData, setSpeechQuizData] = useState({
    title: '',
    duration: '',
    attempts: '',
    questions: [{ content: '' }],
  });

  const [contentType, setContentType] = useState('quiz');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideo((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[`video${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setErrors((prev) => ({ ...prev, [`video${name.charAt(0).toUpperCase() + name.slice(1)}`]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, value } = e.target;
    setFile((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[`quiz${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setErrors((prev) => ({ ...prev, [`quiz${name.charAt(0).toUpperCase() + name.slice(1)}`]: '' }));
    }
  };

  const handleSpeechQuizChange = (e) => {
    const { name, value } = e.target;
    setSpeechQuizData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[`speechQuiz${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setErrors((prev) => ({ ...prev, [`speechQuiz${name.charAt(0).toUpperCase() + name.slice(1)}`]: '' }));
    }
  };

  const handleQuestionChange = (index, e, isSpeechQuiz = false) => {
    const { name, value } = e.target;
    const setData = isSpeechQuiz ? setSpeechQuizData : setQuizData;
    setData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index][name] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    setQuizData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].answers[answerIndex] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const addQuestion = (isSpeechQuiz = false) => {
    const setData = isSpeechQuiz ? setSpeechQuizData : setQuizData;
    setData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        isSpeechQuiz ? { content: '' } : { content: '', answers: ['', '', '', ''], correctAnswer: '', points: '' },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setSubmitError('');
    setSubmitSuccess('');

    const newErrors = {};
    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    if (!formData.order || formData.order < 1) {
      newErrors.order = 'Order must be a positive number';
    }
    if (contentType === 'quiz') {
      if (!quizData.title || quizData.title.trim().length < 3) {
        newErrors.quizTitle = 'Quiz title must be at least 3 characters long';
      }
      // Validate questions
      quizData.questions.forEach((question, index) => {
        if (!question.content || question.content.trim().length === 0) {
          newErrors[`questions[${index}].content`] = 'Question content is required';
        }
        const validAnswers = question.answers.filter(a => a.trim() !== '');
        if (validAnswers.length < 2) {
          newErrors[`questions[${index}].answers`] = 'At least 2 answers are required';
        }
        if (!question.correctAnswer || question.correctAnswer.trim() === '') {
          newErrors[`questions[${index}].correctAnswer`] = 'Correct answer is required';
        }
      });
    } else if (contentType === 'speechQuiz') {
      if (!speechQuizData.title || speechQuizData.title.trim().length < 3) {
        newErrors.speechQuizTitle = 'Speech quiz title must be at least 3 characters long';
      }
      // Validate speech quiz questions
      speechQuizData.questions.forEach((question, index) => {
        if (!question.content || question.content.trim().length === 0) {
          newErrors[`speechQuestions[${index}].content`] = 'Question prompt is required';
        }
      });
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitError('Please fix the validation errors before submitting');
      return;
    }

    const payload = {
      ...formData,
      video,
      file,
      [contentType]: {
        title: contentType === 'quiz' ? quizData.title : speechQuizData.title,
        duration: contentType === 'quiz' ? quizData.duration || null : speechQuizData.duration || null,
        attempts: contentType === 'quiz' ? quizData.attempts || '3' : speechQuizData.attempts || '3',
        questions: (contentType === 'quiz' ? quizData.questions : speechQuizData.questions).map((question) => ({
          content: question.content,
          ...(contentType === 'quiz' && {
            answers: question.answers.filter((answer) => answer.trim() !== ''),
            correctAnswer: question.correctAnswer,
            points: question.points || '',
          }),
        })),
      },
    };

    if (payload.courseId === undefined) {
      console.log('id unknown');
      payload.courseId = id;
      console.log('id:', payload.courseId);
    }

    try {
      const response = await fetch('/api/sequences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sequence created:', data);
        setSubmitSuccess('Sequence created successfully!');
        // Reset form
        setFormData({ title: '', order: '', courseId: id });
        setVideo({ title: '', duration: '', format: '', link: '', thumbnail: '' });
        setFile({ fileName: '', url: '' });
        setQuizData({
          title: '',
          duration: '',
          attempts: '',
          questions: [{ content: '', answers: ['', '', '', ''], correctAnswer: '', points: '' }],
        });
        setSpeechQuizData({
          title: '',
          duration: '',
          attempts: '',
          questions: [{ content: '' }],
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to create sequence:', errorData);
        setSubmitError(errorData.error || 'Failed to create sequence');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Error submitting form. Please try again.');
    }
  };

  return (
    <main className="py-6">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormCard title="New Sequence">
          <div className="col-span-2">
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

        <FormCard title="Content Type">
          <div className="col-span-3">
            <label className="mr-4">
              <input
                type="radio"
                name="contentType"
                value="quiz"
                checked={contentType === 'quiz'}
                onChange={() => setContentType('quiz')}
                className="mr-2"
              />
              Quiz
            </label>
            <label>
              <input
                type="radio"
                name="contentType"
                value="speechQuiz"
                checked={contentType === 'speechQuiz'}
                onChange={() => setContentType('speechQuiz')}
                className="mr-2"
              />
              Speech Quiz
            </label>
          </div>
        </FormCard>

        {contentType === 'quiz' && (
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

            <p className="col-span-3 text-md font-bold">Questions:</p>
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
                    onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
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
                onClick={() => addQuestion()}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Add Question
              </button>
            </div>
          </FormCard>
        )}

        {contentType === 'speechQuiz' && (
          <FormCard title="Speech Quiz">
            <Input
              type="text"
              name="title"
              placeholder="Speech quiz title"
              value={speechQuizData.title}
              onChange={handleSpeechQuizChange}
              error={errors.speechQuizTitle}
            />
            <Input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              value={speechQuizData.duration}
              onChange={handleSpeechQuizChange}
              error={errors.speechQuizDuration}
            />
            <Input
              type="number"
              name="attempts"
              placeholder="Attempts"
              value={speechQuizData.attempts}
              onChange={handleSpeechQuizChange}
              error={errors.speechQuizAttempts}
            />

            <p className="col-span-3 text-md font-bold">Questions:</p>
            {speechQuizData.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="grid gap-2 border p-2 rounded">
                <Input
                  type="text"
                  name="content"
                  placeholder={`Question #${questionIndex + 1} Prompt (e.g., Describe X)`}
                  value={question.content}
                  onChange={(e) => handleQuestionChange(questionIndex, e, true)}
                  error={errors[`speechQuestions[${questionIndex}].content`]}
                />
              </div>
            ))}

            <div className="col-span-3">
              <button
                type="button"
                onClick={() => addQuestion(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Add Question
              </button>
            </div>
          </FormCard>
        )}

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {submitError}
          </div>
        )}
        
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {submitSuccess}
          </div>
        )}

        <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded">
          Save Sequence
        </button>
      </form>
    </main>
  );
}
export { adminServerSideProps as getServerSideProps } from "@/lib/admin-auth";
