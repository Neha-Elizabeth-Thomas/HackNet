import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import UploadComponent from "../components/UploadComponent";
import CourseCard from "../components/CourseCard";
import api from "../services/api";

const DashboardPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Could not fetch courses.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUploadSuccess = (newCourse) => {
    setCourses((prevCourses) => [newCourse, ...prevCourses]);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (err) {
      console.error("Failed to delete course:", err);
      alert("Could not delete the course. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-[Inter]">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto py-10 px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Your Courses
            </h1>
            <span className="text-sm text-gray-500">
              {courses.length} {courses.length === 1 ? "course" : "courses"}
            </span>
          </div>

          {/* Loading / Error State */}
          {isLoading && (
            <p className="text-center text-gray-500 animate-pulse">
              Loading your courses...
            </p>
          )}
          {error && (
            <p className="text-center text-red-500 font-medium">{error}</p>
          )}

          {/* Courses Grid */}
          {!isLoading && !error && (
            <>
              {courses.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <div className="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <CourseCard
                        key={course._id}
                        course={course}
                        onDelete={handleDeleteCourse}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8 italic">
                  No courses found. Add one below to get started!
                </p>
              )}

              {/* Upload Component */}
              <div className="mt-14 border-t pt-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Add a New Course
                </h2>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <UploadComponent onUploadSuccess={handleUploadSuccess} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
