import React, { useState } from 'react';
import api from '../services/api';

const UploadComponent = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: 1,
    tuesday: 1,
    wednesday: 1,
    thursday: 1,
    friday: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setWeeklySchedule((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !courseName || !courseCode || !startDate) {
      setError('Please fill in all fields and select a file.');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('syllabusFile', file);
    formData.append('courseName', courseName);
    formData.append('courseCode', courseCode);
    formData.append('startDate', startDate);
    formData.append('weeklySchedule', JSON.stringify(weeklySchedule));

    try {
      const { data } = await api.post('/syllabus/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadSuccess(data.course);
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two-column layout for course details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">
              Course Code
            </label>
            <input
              type="text"
              id="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Course Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
        </div>

        {/* Weekly Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Weekly Hours Allocation
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.keys(weeklySchedule).map((day) => (
              <div key={day}>
                <label
                  htmlFor={day}
                  className="capitalize block text-xs font-medium text-gray-600 mb-1"
                >
                  {day}
                </label>
                <input
                  type="number"
                  id={day}
                  name={day}
                  value={weeklySchedule[day]}
                  onChange={handleScheduleChange}
                  min="0"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Teaching Plan
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {isLoading ? 'Processing...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default UploadComponent;
