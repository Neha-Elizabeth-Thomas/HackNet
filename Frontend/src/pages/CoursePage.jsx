// CoursePage.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import confetti from "canvas-confetti";

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const timelineRef = useRef(null);

  // svg dims & path
  const [svgSize, setSvgSize] = useState({ width: 1000, height: 800 });
  const [pathD, setPathD] = useState("");
  const prevProgress = useRef(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);
      } catch (err) {
        setError("Could not fetch course details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const buildVerticalWavePath = (width, height, waveHeight = 220, amplitude = 120) => {
    const cx = width / 2;
    const waves = Math.max(1, Math.ceil(height / waveHeight));
    let d = `M ${cx} 0 `;
    for (let i = 0; i < waves; i++) {
      const dir = i % 2 === 0 ? 1 : -1;
      const cp1x = cx + dir * amplitude;
      const cp1y = i * waveHeight + waveHeight * 0.35;
      const cp2x = cx + dir * amplitude;
      const cp2y = (i + 0.5) * waveHeight;
      const endx = cx;
      const endy = Math.min((i + 1) * waveHeight, height);
      d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endx} ${endy} `;
    }
    return d;
  };

  useLayoutEffect(() => {
    if (!timelineRef.current) return;
    const recompute = () => {
      const el = timelineRef.current;
      const height = Math.max(600, el.scrollHeight + 200);
      const width = el.clientWidth || 1000;
      setSvgSize({ width, height });
      const d = buildVerticalWavePath(width, height, 260, Math.min(150, width * 0.12));
      setPathD(d);
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [course?.syllabusId?.topics?.length]);

  const handleTopicToggle = async (topicId, currentStatus) => {
    const syllabusId = course.syllabusId._id;
    try {
      const { data } = await api.put(`/syllabus/${syllabusId}/topics/${topicId}`, {
        isCompleted: !currentStatus,
      });
      setCourse((prev) => ({ ...prev, syllabusId: data.syllabus }));
    } catch (err) {
      console.error("Failed to update topic status");
    }
  };

  // calculate progress
  const progress = course?.syllabusId?.topics?.length
    ? (course.syllabusId.topics.filter((t) => t.isCompleted).length /
        course.syllabusId.topics.length) *
      100
    : 0;

  // trigger confetti once when hitting 100%
  useEffect(() => {
    if (progress === 100 && prevProgress.current < 100) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
    prevProgress.current = progress;
  }, [progress]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">{course.courseName}</h1>
        <p className="text-lg text-gray-600 mb-6">{course.courseCode}</p>

        {/* Modern Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-5 mb-10 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mb-8 text-gray-700 font-medium">{Math.round(progress)}% Completed</p>

        {/* TIMELINE */}
        <div ref={timelineRef} className="relative w-full px-8 py-8" style={{ overflow: "visible" }}>
          {/* SVG PATH */}
          <svg
            width={svgSize.width}
            height={svgSize.height}
            viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
            preserveAspectRatio="none"
            className="absolute left-0 top-0 w-full"
            style={{ zIndex: 0, pointerEvents: "none" }}
          >
            <path
              d={pathD}
              stroke="#cbd5e1"
              strokeWidth="4"
              strokeDasharray="8 10"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* TOPICS */}
          <div className="relative z-10 space-y-24">
            {course.syllabusId.topics.map((topic, index) => {
              const colors = ["bg-indigo-600", "bg-emerald-500", "bg-orange-500", "bg-pink-500", "bg-yellow-500"];
              const blobColor = colors[index % colors.length];
              const isCompleted = topic.isCompleted;
              return (
                <div
                  key={topic.topicId}
                  className={`flex items-center justify-between ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Blob Marker */}
                  <div className="flex-shrink-0 w-14 h-14 relative">
                    <div className={`absolute inset-0 rounded-full shadow-lg ${blobColor}`} />
                    {isCompleted && (
                      <svg
                        className="absolute inset-0 m-auto h-7 w-7 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Card */}
                  <div
                  className={`w-5/12 p-6 rounded-3xl shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 border border-gray-100 ${
                    index % 2 === 0 ? "ml-6" : "mr-6"
                  }`}
                >
                  {/* Date */}
                  <p className="text-xs font-medium text-gray-500 tracking-wide uppercase mb-1">
                    {new Date(topic.targetDate).toLocaleDateString()}
                  </p>

                  {/* Title */}
                  <h4 className="font-bold text-2xl text-gray-800 mb-2">{topic.title}</h4>

                  {/* Module */}
                  <p className="text-sm text-gray-600 mb-5">{topic.module}</p>

                  {/* Toggle Switch */}
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">
                      {isCompleted ? "Completed" : "Mark as complete"}
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => handleTopicToggle(topic.topicId, topic.isCompleted)}
                        className="sr-only peer"
                      />

                      {/* Toggle Track */}
                      <div
                        className={`block w-12 h-7 rounded-full transition-all duration-300 ${
                          isCompleted ? "bg-indigo-600 shadow-[0_0_12px_#4f46e5]" : "bg-gray-300"
                        }`}
                      ></div>

                      {/* Toggle Dot */}
                      <div
                        className={`dot absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                          isCompleted ? "translate-x-5" : ""
                        }`}
                      ></div>

                    </div>
                  </label>
                </div>

                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
