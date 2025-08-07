import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/course/${course._id}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      <h3 className="text-xl font-bold text-gray-800">{course.courseName}</h3>
      <p className="text-md text-gray-500 mt-2">{course.courseCode}</p>
    </div>
  );
};

export default CourseCard;
