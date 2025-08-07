import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/course/${course._id}`);
  };

  const handleDeleteClick = (e) => {
    // Stop the click from bubbling up to the card's main click handler
    e.stopPropagation();
    
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
        onDelete(course._id);
    }
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col justify-between"
    >
      <div>
        <h3 className="text-xl font-bold text-gray-800">{course.courseName}</h3>
        <p className="text-md text-gray-500 mt-2">{course.courseCode}</p>
      </div>
      <button
        onClick={handleDeleteClick}
        className="mt-4 self-end py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Delete
      </button>
    </div>
  );
};

export default CourseCard;
