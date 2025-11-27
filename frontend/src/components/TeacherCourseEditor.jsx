// src/pages/TeacherCourseEditor.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebaseService";
import { ref, get, set, remove } from "firebase/database";

const TeacherCourseEditor = () => {
  const { courseId } = useParams();

  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    goals: "",
    keywords: "",
    teacherPrompt: "",
    example: "",
    videoUrl: ""
  });

  // 🔥 주차 데이터 불러오기
  const loadWeeks = async () => {
    if (!courseId) return;

    setLoading(true);

    const weeksRef = ref(db, `courses/${courseId}/weeks`);
    const snap = await get(weeksRef);

    if (snap.exists()) {
      const data = snap.val();
      const weekList = Object.entries(data).map(([week, value]) => ({
        week: Number(week),
        ...value,
      }));

      setWeeks(weekList);
    } else {
      setWeeks([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadWeeks();
  }, [courseId]);

  // 입력 핸들러
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 주차 선택
  const selectWeek = async (week) => {
    setSelectedWeek(week);

    const docRef = ref(db, `courses/${courseId}/weeks/${week}`);
    const snap = await get(docRef);

    if (snap.exists()) {
      const data = snap.val();
      setForm({
        title: data.title || "",
        summary: data.summary || "",
        goals: data.goals || "",
        keywords: (data.keywords || []).join(", "),
        teacherPrompt: data.teacherPrompt || "",
        example: data.example || "",
        videoUrl: data.videoUrl || "",
      });
    } else {
      setForm({
        title: "",
        summary: "",
        goals: "",
        keywords: "",
        teacherPrompt: "",
        example: "",
        videoUrl: "",
      });
    }
  };

  // 저장
  const saveWeek = async () => {
    if (!selectedWeek) return alert("주차를 선택하세요!");

    const data = {
      week: selectedWeek,
      title: form.title,
      summary: form.summary,
      goals: form.goals,
      keywords: form.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== ""),
      teacherPrompt: form.teacherPrompt,
      example: form.example,
      videoUrl: form.videoUrl,
      updatedAt: new Date().toISOString(),
    };

    await set(ref(db, `courses/${courseId}/weeks/${selectedWeek}`), data);

    alert(`${selectedWeek}주차 저장 완료`);
    loadWeeks();
  };

  // 삭제
  const deleteWeek = async () => {
    if (!selectedWeek) return alert("삭제할 주차를 선택하세요!");

    await remove(ref(db, `courses/${courseId}/weeks/${selectedWeek}`));
    alert(`${selectedWeek}주차 삭제 완료`);

    setSelectedWeek(null);
    loadWeeks();
  };

  if (loading) return <div className="p-6 text-accent">로딩 중...</div>;

  return (
    <div className="flex h-screen bg-primary text-accent">

      {/* LEFT SIDE — 주차 목록 */}
      <aside className="w-1/4 border-r border-primary-light bg-primary-light p-6">
        <h2 className="text-xl font-bold mb-4">주차 목록</h2>

        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => {
            const weekNum = i + 1;
            const weekData = weeks.find((w) => w.week === weekNum);

            const isSelected = selectedWeek === weekNum;

            return (
              <div
                key={weekNum}
                onClick={() => selectWeek(weekNum)}
                className={`p-3 rounded cursor-pointer border transition ${
                  isSelected
                    ? "bg-accent text-primary border-accent"
                    : "bg-primary text-accent/70 border-primary-light hover:bg-primary-light"
                }`}
              >
                {weekNum}주차 — {weekData?.title || "제목 없음"}
              </div>
            );
          })}
        </div>
      </aside>

      {/* RIGHT SIDE — 입력폼 */}
      <main className="w-3/4 p-10 overflow-y-scroll">
        <h1 className="text-2xl font-bold mb-6 text-accent">
          {selectedWeek ? `${selectedWeek}주차 강의 내용 입력` : "주차를 선택해주세요"}
        </h1>

        {selectedWeek && (
          <div className="space-y-6 bg-white text-black shadow-xl rounded-2xl p-8">

            {/* 제목 */}
            <div>
              <label className="block font-semibold">주차 제목</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            {/* 영상 URL */}
            <div>
              <label className="block font-semibold">영상 URL</label>
              <input
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            {/* 요약 */}
            <div>
              <label className="block font-semibold">요약 (summary)</label>
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                className="w-full border p-3 rounded h-24"
              />
            </div>

            {/* 학습 목표 */}
            <div>
              <label className="block font-semibold">학습 목표 (goals)</label>
              <textarea
                name="goals"
                value={form.goals}
                onChange={handleChange}
                className="w-full border p-3 rounded h-24"
              />
            </div>

            {/* 키워드 */}
            <div>
              <label className="block font-semibold">
                키워드 (keywords, 콤마로 구분)
              </label>
              <input
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* 강사 프롬프트 */}
            <div>
              <label className="block font-semibold">강사 프롬프트 (teacherPrompt)</label>
              <textarea
                name="teacherPrompt"
                value={form.teacherPrompt}
                onChange={handleChange}
                className="w-full border p-3 rounded h-40"
              />
            </div>

            {/* 예시 */}
            <div>
              <label className="block font-semibold">예시 (example)</label>
              <textarea
                name="example"
                value={form.example}
                onChange={handleChange}
                className="w-full border p-3 rounded h-20"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={saveWeek}
                className="px-6 py-3 bg-accent text-primary font-bold rounded-lg shadow hover:bg-accent/90 transition"
              >
                저장하기
              </button>

              <button
                onClick={deleteWeek}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition"
              >
                삭제하기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherCourseEditor;
