import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormCard from '@/components/ui/FormCard';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import CustomLink from '@/components/ui/CustomLink';
import AdminSequenceCard from '@/components/ui/Cards/AdminSequenceCard';

const CourseDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
          setExam(response.data.exam)
        
      } catch (err) {
        setError('Failed to fetch course data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  // Form input change handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setIsLoading(true);

    try {
      const updatedFormData = { ...formData, exam };
      await axios.put(`/api/courses/${id}`, updatedFormData);
      router.push(`/admin/courses/${id}`);
    } catch (err) {
      setError('Failed to update course');
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
            <FormCard title="Basic Information" gridCols={2}>
              <Input
                label="Title"
                name="title"
                value={formData?.title || ''}
                onChange={handleChange}
              />
              <Input
                label="Price"
                name="price"
                type="number"
                value={formData?.price || ''}
                onChange={handleChange}
              />
              <Input
                label="Thumbnail URL"
                name="thumbnail"
                value={formData?.thumbnail || ''}
                onChange={handleChange}
                className="col-span-2"
              />
              <Input
                label="Description"
                name="description"
                value={formData?.description || ''}
                onChange={handleChange}
                className="col-span-2"
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
              />
              <Input
                type="number"
                placeholder="Passing Score (%)"
                value={exam.passingScore}
                onChange={(e) => handleExamChange('passingScore', parseInt(e.target.value, 10))}
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
                  <Input
                    placeholder="Correct Answer"
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(questionIndex, 'correctAnswer', e.target.value)
                    }
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
