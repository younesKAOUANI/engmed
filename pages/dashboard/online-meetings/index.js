import React, { useState } from 'react';
import { teachers, meetingDurations, meetingTopics, timeSlots } from '@/data/teachers';
import { Calendar, Clock, Video, Star, Languages, BookOpen, User, Mail, Phone, MessageSquare } from 'lucide-react';
import Title from '@/components/ui/Title';

export default function OnlineMeetingsPage() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formData, setFormData] = useState({
    teacherId: '',
    date: '',
    time: '',
    duration: 60,
    topic: '',
    message: '',
    studentName: '',
    studentEmail: '',
    studentPhone: ''
  });

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({ ...formData, teacherId: teacher.id });
    setShowBookingModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to backend API
    alert(`Meeting request submitted!\n\nTeacher: ${selectedTeacher.name}\nDate: ${formData.date}\nTime: ${formData.time}\nDuration: ${formData.duration} minutes\n\nYou will receive a confirmation email shortly.`);
    setShowBookingModal(false);
    setFormData({
      teacherId: '',
      date: '',
      time: '',
      duration: 60,
      topic: '',
      message: '',
      studentName: '',
      studentEmail: '',
      studentPhone: ''
    });
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedTeacher(null);
  };

  // Get tomorrow's date as minimum date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <Title>Book an Online Meeting</Title>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mt-2">
          Schedule a one-on-one session with our expert medical English instructors. Get personalized guidance and improve your communication skills.
        </p>
      </div>

      <div className="container mx-auto px-4">
        {/* Info Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Video className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How it works</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Choose your preferred instructor based on their expertise</li>
                <li>✓ Select a convenient date and time</li>
                <li>✓ Receive a confirmation email with the meeting link</li>
                <li>✓ Join the session via Zoom or Google Meet</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Teacher Header */}
              <div className="h-32 bg-gradient-to-r from-primary to-teal-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="w-16 h-16 text-white/70" />
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-800">{teacher.rating}</span>
                </div>
              </div>

              {/* Teacher Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {teacher.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-3">
                  {teacher.title}
                </p>
                
                <p className="text-gray-600 text-sm mb-4">
                  {teacher.bio}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4 text-primary" />
                    <span>{teacher.totalSessions} sessions</span>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.expertise.map((exp, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <Languages className="w-4 h-4 text-primary" />
                  <span>{teacher.languages.join(', ')}</span>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{teacher.availability}</span>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleTeacherSelect(teacher)}
                  className="w-full bg-primary hover:bg-teal-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Book a Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-teal-400 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Book a Session</h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-white/90">with {selectedTeacher.name}</p>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Student Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Your Information
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="studentName"
                    placeholder="Your Full Name *"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="email"
                    name="studentEmail"
                    placeholder="Your Email *"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="tel"
                    name="studentPhone"
                    placeholder="Your Phone Number (optional)"
                    value={formData.studentPhone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Schedule
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={getTomorrowDate()}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Time *</label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Duration *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  {meetingDurations.map((duration) => (
                    <option key={duration.id} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Topic *
                </label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">Select a topic</option>
                  {meetingTopics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Additional Message (optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell the instructor what you'd like to focus on or any specific questions you have..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
