import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormCard from '@/components/ui/FormCard';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import CustomLink from '@/components/ui/CustomLink';
import AdminSequenceCard from '@/components/ui/Cards/AdminSequenceCard';

const CourseDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({}); // Field validation errors
  const [exam, setExam] = useState({
    title: '',
    duration: '',
    passingScore: '',
    questions: [],
  });

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const response = await axios.get(`/api/courses/${id}`);
        setFormData(response.data);
        if (response.data.exam) {
          setExam(response.data.exam);
        }
      } catch (err) {
        setError('Failed to fetch course data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  console.log(formData);
  // Form input change handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePublishedChange = (e) => {
    setFormData((prev) => ({ ...prev, published: e.target.checked }));
  };

  const handleSequenceChange = (index, field, value) => {
    setFormData((prev) => {
      const newSequences = [...prev.sequences];
      newSequences[index] = { ...newSequences[index], [field]: value };
      return { ...prev, sequences: newSequences };
    });
  };

  const handleRemoveSequence = (index) => {
    setFormData((prev) => ({
      ...prev,
      sequences: prev.sequences.filter((_, i) => i !== index),
    }));
  };

  const handleExamChange = (field, value) => {
    setExam((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[index][field] = value;
    setExam((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const updatedQuestions = [...exam.questions];
    updatedQuestions[questionIndex].answers[answerIndex] = value;
    setExam((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const addQuestion = () => {
    setExam((prev) => ({
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

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    setError(null);

    // Validation
    const newErrors = {};
    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }
    if (formData.thumbnail && !formData.thumbnail.match(/^https?:\/\/.+/)) {
      newErrors.thumbnail = 'Thumbnail must be a valid URL';
    }
    
    // Validate exam if exists
    if (exam && exam.title) {
      if (!exam.duration || exam.duration < 1) {
        newErrors.examDuration = 'Exam duration must be at least 1 minute';
      }
      if (!exam.passingScore || exam.passingScore < 0 || exam.passingScore > 100) {
        newErrors.examPassingScore = 'Passing score must be between 0 and 100';
      }
      
      exam.questions.forEach((question, index) => {
        if (!question.content || question.content.trim().length === 0) {
          newErrors[`examQuestion${index}`] = `Question #${index + 1} content is required`;
        }
        const validAnswers = question.answers.filter(a => a && a.trim() !== '');
        if (validAnswers.length < 2) {
          newErrors[`examAnswers${index}`] = `Question #${index + 1} must have at least 2 answers`;
        }
        if (!question.correctAnswer || question.correctAnswer.trim() === '') {
          newErrors[`examCorrectAnswer${index}`] = `Question #${index + 1} must have a correct answer`;
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setError('Please fix the validation errors before saving');
      return;
    }

    setIsLoading(true);

    try {
      const updatedFormData = { ...formData, exam };
      await axios.put(`/api/courses/${id}`, updatedFormData);
      setError(null);
      alert('Course updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update course';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete course
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/courses/${id}`);
        router.push('/courses');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          onClick={() => router.push('/courses')}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Course: {formData?.title}</h1>
          <Button
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md"
          >
            Delete Course
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Image
            width={400}
            height={400}
            src={formData?.thumbnail || '/placeholder.png'}
            alt={formData?.title || 'Course Thumbnail'}
            className="w-full h-64 object-cover rounded order-2"
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <FormCard title="Basic Information" gridCols={2}>
              <Input
                label="Title"
                name="title"
                value={formData?.title || ''}
                onChange={handleChange}
                error={errors.title}
              />
              <Input
                label="Price"
                name="price"
                type="number"
                value={formData?.price || ''}
                onChange={handleChange}
                error={errors.price}
              />
              <Input
                label="Thumbnail URL"
                name="thumbnail"
                value={formData?.thumbnail || ''}
                onChange={handleChange}
                className="col-span-2"
                error={errors.thumbnail}
              />
              <Input
                label="Description"
                name="description"
                value={formData?.description || ''}
                onChange={handleChange}
                className="col-span-2"
                error={errors.description}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData?.published || false}
                  onChange={handlePublishedChange}
                  className="form-checkbox"
                />
                <label htmlFor="published">Published</label>
              </div>
            </FormCard>

            <div className="bg-white shadow-md p-4 rounded-lg">
              <p className="text-lg font-semibold mb-4">Sequences</p>
              <AdminSequenceCard
                sequences={formData?.sequences || []}
                handleSequenceChange={handleSequenceChange}
                handleRemoveSequence={handleRemoveSequence}
              />
              <CustomLink
                href={`/admin/courses/${id}/new-sequence`}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Add Sequence
              </CustomLink>
            </div>

            <FormCard title="Exam">
              <Input
                placeholder="Exam Title"
                value={exam.title}
                onChange={(e) => handleExamChange('title', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={exam.duration}
                onChange={(e) => handleExamChange('duration', parseInt(e.target.value, 10))}
                error={errors.examDuration}
              />
              <Input
                type="number"
                placeholder="Passing Score (%)"
                value={exam.passingScore}
                onChange={(e) => handleExamChange('passingScore', parseInt(e.target.value, 10))}
                error={errors.examPassingScore}
              />
              <p className="text-md font-bold mt-4 col-span-3">Questions:</p>
              {exam.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border p-2 rounded mt-2">
                  <Input
                    placeholder={`Question #${questionIndex + 1}`}
                    value={question.content}
                    onChange={(e) =>
                      handleQuestionChange(questionIndex, 'content', e.target.value)
                    }
                    error={errors[`examQuestion${questionIndex}`]}
                  />
                  {question.answers.map((answer, answerIndex) => (
                    <Input
                      key={answerIndex}
                      placeholder={`Answer #${answerIndex + 1}`}
                      value={answer}
                      onChange={(e) =>
                        handleAnswerChange(questionIndex, answerIndex, e.target.value)
                      }
                    />
                  ))}
                  {errors[`examAnswers${questionIndex}`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`examAnswers${questionIndex}`]}</p>
                  )}
                  <Input
                    placeholder="Correct Answer"
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(questionIndex, 'correctAnswer', e.target.value)
                    }
                    error={errors[`examCorrectAnswer${questionIndex}`]}
                  />
                  <Input
                    placeholder="Points"
                    type="number"
                    value={question.points}
                    onChange={(e) =>
                      handleQuestionChange(questionIndex, 'points', parseInt(e.target.value, 10))
                    }
                  />
                </div>
              ))}
              <div className="col-span-3">
                <Button
                  type="button"
                  onClick={addQuestion}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Add Question
                </Button>
              </div>
            </FormCard>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CourseDetails;

export { adminServerSideProps as getServerSideProps } from "@/lib/admin-auth";
