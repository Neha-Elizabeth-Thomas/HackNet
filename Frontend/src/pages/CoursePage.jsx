import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
      } catch (err) {
        setError('Could not fetch course details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleTopicToggle = async (topicId, currentStatus) => {
    const syllabusId = course.syllabusId._id;
    try {
        const { data } = await api.put(`/syllabus/${syllabusId}/topics/${topicId}`, {
            isCompleted: !currentStatus
        });
        // Update the local state to reflect the change immediately
        setCourse(prevCourse => ({
            ...prevCourse,
            syllabusId: data.syllabus
        }));
    } catch (err) {
        console.error("Failed to update topic status");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!course) return <div>Course not found.</div>;

  const completedTopics = course.syllabusId.topics.filter(t => t.isCompleted).length;
  const totalTopics = course.syllabusId.topics.length;
  const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">{course.courseName}</h1>
        <p className="text-lg text-gray-600 mb-6">{course.courseCode}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
            <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* The timeline line */}
          <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-300"></div>
          {course.syllabusId.topics.map((topic, index) => (
            <div key={topic.topicId} className="relative pl-12 mb-8">
              {/* Timeline circle */}
              <div className={`absolute left-5 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full ${topic.isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`}></div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">{new Date(topic.targetDate).toLocaleDateString()}</p>
                        <h4 className="font-semibold text-lg">{topic.title}</h4>
                        <p className="text-sm text-gray-600">{topic.module}</p>
                    </div>
                    <div className="flex items-center">
                        <label className="mr-2">{topic.isCompleted ? 'Completed' : 'Mark as complete'}</label>
                        <input 
                            type="checkbox" 
                            checked={topic.isCompleted}
                            onChange={() => handleTopicToggle(topic.topicId, topic.isCompleted)}
                            className="h-5 w-5 text-indigo-600 rounded"
                        />
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
