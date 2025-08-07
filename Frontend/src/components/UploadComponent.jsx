import React, { useState } from 'react';
import api from '../services/api';

const UploadComponent = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

    try {
      const { data } = await api.post('/syllabus/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess(data.course); // Pass the new course data to the parent
    } catch (err) {
      const message = err.response?.data?.message || 'Upload failed.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-xl font-medium text-gray-900">Create a New Course</h2>
      <p className="mt-2 text-gray-600">Upload your syllabus (PDF or image) to get started.</p>
      
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
        {/* Form inputs */}
        <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">Course Name</label>
            <input type="text" id="courseName" value={courseName} onChange={e => setCourseName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">Course Code</label>
            <input type="text" id="courseCode" value={courseCode} onChange={e => setCourseCode(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Course Start Date</label>
            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
        </div>
        <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Syllabus File</label>
            <input type="file" id="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" required />
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
          {isLoading ? 'Processing...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default UploadComponent;
