// src/components/CourseList.jsx
import { useNavigate } from "react-router-dom";

const CourseList = ({ courses, onSelect }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="
            min-w-[250px] bg-white text-primary
            shadow rounded-lg overflow-hidden flex-shrink-0 cursor-pointer 
            hover:bg-white/90 transition
          "
          onClick={() => onSelect(course.id, navigate)}
        >
          {/* 🔥 썸네일 */}
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="h-40 w-full object-cover"
            />
          ) : (
            <div className="h-40 bg-primary/20" />
          )}

          <div className="p-3">

            {/* 🔥 레이블 */}
            {course.label && (
              <div className="inline-block text-primary bg-accent/70 px-2 py-1 text-xs font-semibold rounded">
                {course.label}
              </div>
            )}

            {/* 🔥 제목 */}
            <div className="font-semibold mt-2">
              {course.title}
            </div>

            {/* 🔥 설명 */}
            {course.description && (
              <div className="text-sm text-primary/70 mt-1">
                {course.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
