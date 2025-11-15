import Button from '@/components/ui/Button';
import FormCard from '@/components/ui/FormCard';
import Input from '@/components/ui/Input';
import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';

// Define the Zod schema
const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  price: z.string().regex(/^\d+$/, 'Price must be a valid number'),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
});

export default function Index() {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    thumbnail: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    try {
      // Validate form data with Zod
      const validatedData = courseSchema.parse(formData);
      console.log('validatedData:', validatedData);
      
      // Send to API
      const response = await axios.post('/api/courses', validatedData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Course added successfully:', response.data);
      alert('Course added successfully!');
      setFormData({ title: '', price: '', thumbnail: '', description: '' });
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error('Failed to add course:', err);
        const errorMessage = err.response?.data?.error || 'Failed to add course. Please try again.';
        setErrors({ submit: errorMessage });
      }
    }
  };

  return (
    <main className="py-12">
      <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit}>
        <FormCard title="Add a new course">
          <Input
            type="text"
            name="title"
            placeholder="Course title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
          />

          <Input
            type="text"
            name="price"
            placeholder="Price (DA)"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
          />

          <Input
            type="text"
            name="thumbnail"
            placeholder="Thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            error={errors.thumbnail}

          />

          <Input
            type="text"
            name="description"
            placeholder="Description"
            className="col-span-3"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}

          />
        </FormCard>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        <Button
          type="submit"
          className="font-semibold hover:text-gray-700 hover:shadow-md hover:bg-transparent bg-primary text-white px-4 py-2 rounded-md hover:scale-95"
        >
          Add course
        </Button>
      </form>
    </main>
  );
}
