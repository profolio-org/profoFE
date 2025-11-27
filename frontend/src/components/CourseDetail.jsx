// src/components/CourseDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../services/firebaseService";
import { ref, get } from "firebase/database";
import AiMentor from "./AiMentor";

const CourseDetail = ({ user }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [weeks, setWeeks] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const TOTAL_WEEKS = 8;

  // 🔥 DB에서 등록된 주차 데이터 로딩
  const loadCourseWeeks = async () => {
    setLoading(true);

    const weeksRef = ref(db, `courses/${courseId}/weeks`);
    const snap = await get(weeksRef);

    if (snap.exists()) {
      const data = snap.val();
      const weekArray = Object.entries(data)
        .map(([week, value]) => ({
          week: parseInt(week),
          ...value,
        }))
        .sort((a, b) => a.week - b.week);

      setWeeks(weekArray);
    } else {
      setWeeks([]);
    }

    setLoading(false);
  };

  // 유튜브 URL → embed 변환
  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed")) return url;

    const watchMatch = url.match(/v=([^&]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

    return url;
  };

  useEffect(() => {
    loadCourseWeeks();
  }, [courseId]);

  if (loading) return <div className="p-6 text-lg text-white">로딩 중...</div>;

  const registeredWeekNums = weeks.map((w) => w.week);

  const missingWeeks = Array.from({ length: TOTAL_WEEKS })
    .map((_, i) => i + 1)
    .filter((num) => !registeredWeekNums.includes(num));

  return (
    <div className="flex h-screen bg-primary text-white relative">

      {/* 왼쪽 영역 */}
      <div className="w-2/3 overflow-y-scroll px-10 py-8">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-accent">
            강의 커리큘럼
          </h1>

          {user?.role === "mentor" && (
            <button
              onClick={() => navigate(`/course/${courseId}/edit`)}
              className="bg-accent text-primary px-4 py-2 rounded shadow hover:bg-accent/90"
            >
              강의 수정하기
            </button>
          )}
        </div>

        <div className="space-y-4">

          {/* 🔥 등록된 주차들 */}
          {weeks.map((item, index) => {
            const isEmptyItem =
              (!item.title || !item.title.trim()) &&
              (!item.summary || !item.summary.trim()) &&
              (!item.videoUrl || !item.videoUrl.trim());

            // 내용 없는 주차 → 비활성 박스
            if (isEmptyItem) {
              return (
                <div
                  key={`empty-${item.week}`}
                  className="bg-primary/40 border border-primary/30 rounded-xl p-4 opacity-50 cursor-not-allowed"
                >
                  <span className="text-lg font-semibold text-accent/70">
                    {item.week}주차 — (내용 없음)
                  </span>
                </div>
              );
            }

            // 내용 있는 주차 → 아코디언
            return (
              <div
                key={`filled-${item.week}`}
                className="bg-white text-primary rounded-xl shadow border border-accent/20"
              >
                <div
                  className="p-4 cursor-pointer flex justify-between items-center hover:bg-accent/20"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <span className="text-lg font-semibold">
                    {item.week}주차 — {item.title || "제목 없음"}
                  </span>
                  <span className="text-primary">
                    {openIndex === index ? "▲" : "▼"}
                  </span>
                </div>

                {openIndex === index && (
                  <div className="px-4 pb-4">
                    <p className="text-primary/80 mb-4">
                      {item.summary || "요약 내용이 없습니다."}
                    </p>

                    {item.videoUrl ? (
                      <div className="w-full h-64 bg-primary/20 rounded-lg shadow-inner overflow-hidden">
                        <iframe
                          src={convertToEmbedUrl(item.videoUrl)}
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-primary/10 rounded-lg flex items-center justify-center text-primary/50">
                        영상이 등록되지 않았습니다.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* 🔥 아예 존재하지 않는 주차 */}
          {missingWeeks.map((weekNum) => (
            <div
              key={`missing-${weekNum}`}
              className="bg-primary/40 border border-primary/30 rounded-xl p-4 opacity-50 cursor-not-allowed"
            >
              <span className="text-lg font-semibold text-accent/70">
                {weekNum}주차 — (미등록)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 AiMentor 패널 — 🔥 Glass + Floating 스타일 */}
      <div
        className="
          w-[32%]
          h-[85%]
          fixed
          top-13 right-4
          bg-white/15
          backdrop-blur-md
          border border-accent/20
          rounded-2xl
          shadow-2xl
          p-6
          text-primary
          overflow-hidden
        "
      >
        <AiMentor
          courseId={courseId}
          currentWeek={openIndex !== null ? openIndex + 1 : 1}
          totalWeeks={TOTAL_WEEKS}
          student={{
            name: user?.displayName || "익명",
            id: user?.uid || "unknown",
          }}
        />
      </div>
    </div>
  );
};

export default CourseDetail;
