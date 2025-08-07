import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import UploadComponent from '../components/UploadComponent';
import CourseCard from '../components/CourseCard';
import api from '../services/api';

const DashboardPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (err) {
      const message = err.response?.data?.message || 'Could not fetch courses.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Callback function to add the new course to the list after a successful upload
  const handleUploadSuccess = (newCourse) => {
    setCourses(prevCourses => [newCourse, ...prevCourses]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Courses</h1>
            
            {isLoading && <p className="text-center">Loading your courses...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!isLoading && !error && (
              <>
                {/* Display existing courses or a message if none exist */}
                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">
                    No courses found. Add one below to get started!
                  </p>
                )}

                {/* Always display the upload component below the course list */}
                <div className="mt-12 border-t pt-8">
                  <UploadComponent onUploadSuccess={handleUploadSuccess} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
