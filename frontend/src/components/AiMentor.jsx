// src/components/AiMentor.jsx
import React, { useState, useEffect, useCallback } from "react";
import { db } from "../services/firebaseService";
import { ref, get } from "firebase/database";
import { askOpenAI } from "../services/openaiService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AiMentor = ({ currentWeek, totalWeeks, courseId, student }) => {
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [teacherPrompt, setTeacherPrompt] = useState("");
  const [weeksData, setWeeksData] = useState({});
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  /** 🔥 1) 전체 주차 데이터 로딩 */
  const loadWeeksData = useCallback(async () => {
    if (!courseId) return;

    const weeksRef = ref(db, `courses/${courseId}/weeks`);
    const snap = await get(weeksRef);

    if (snap.exists()) {
      setWeeksData(snap.val());
    } else {
      setWeeksData({});
    }
  }, [courseId]);

  useEffect(() => {
    loadWeeksData();
  }, [loadWeeksData]);

  /** 🔥 2) 주차 teacherPrompt 불러오기 */
  const loadTeacherPrompt = useCallback(async () => {
    if (!courseId || !selectedWeek) return;

    const weekRef = ref(db, `courses/${courseId}/weeks/${selectedWeek}`);
    const snap = await get(weekRef);

    if (snap.exists()) {
      setTeacherPrompt(snap.val().teacherPrompt || "");
    } else {
      setTeacherPrompt("");
    }
  }, [courseId, selectedWeek]);

  useEffect(() => {
    loadTeacherPrompt();
  }, [loadTeacherPrompt]);

  /** 🔥 3) 해당 주차가 내용이 있는지 검사하는 함수 */
  const isWeekActive = (weekNum) => {
    const data = weeksData[weekNum];
    if (!data) return false;

    const noTitle = !data.title || data.title.trim() === "";
    const noSummary = !data.summary || data.summary.trim() === "";
    const noVideo = !data.videoUrl || data.videoUrl.trim() === "";

    return !(noTitle && noSummary && noVideo);
  };

  /** 🔥 학생 질문 처리 */
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "student", text: input };
    setMessages(prev => [...prev, userMsg]);

    const question = input;
    setInput("");
    setLoading(true);

    const fullPrompt = `
당신은 강사의 보조 AI 튜터입니다.

[학생 정보]
이름: ${student?.name}
ID: ${student?.id}

[강의 정보]
강의 ID: ${courseId}
주차: ${selectedWeek}

[강사의 수업 내용 요약]
${teacherPrompt || "등록된 강의 요약이 없습니다."}

[학생 질문]
${question}

위 내용을 바탕으로 초보자도 이해할 수 있게 설명해주세요.
    `;

    try {
      const aiResponse = await askOpenAI(fullPrompt);
      const aiMsg = { sender: "ai", text: aiResponse };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "⚠️ AI 응답 중 오류가 발생했습니다." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">

      {/* 🔘 주차 선택 버튼 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {[...Array(totalWeeks)].map((_, idx) => {
          const weekNum = idx + 1;
          const active = isWeekActive(weekNum);

          return (
            <button
              key={weekNum}
              disabled={!active}
              onClick={() => active && setSelectedWeek(weekNum)}
              className={`
                px-4 py-2 rounded-xl text-sm font-semibold transition-all 
                ${active
                  ? selectedWeek === weekNum
                    ? "bg-accent text-primary shadow-md shadow-accent/30"        /* 선택됨 */
                    : "bg-primary/30 text-accent hover:bg-primary/40"            /* 선택 안됨 */
                  : "bg-primary/20 text-accent/30 cursor-not-allowed opacity-90" /* 비활성 */
                }
              `}
            >
              {weekNum}주차
            </button>
          );
        })}
      </div>

      {/* 메시지 박스 */}
      <div className="flex-1 bg-gray-50 p-3 rounded overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 mb-2 rounded text-sm ${
              msg.sender === "student"
                ? "bg-indigo-100"
                : "bg-white border"
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="p-2 text-gray-700">AI 멘토가 답변 생성 중…</div>
        )}
      </div>

      {/* 입력창 */}
      <div className="mt-3 flex">
        <input
          className="flex-1 p-2 border rounded"
          placeholder={`${selectedWeek}주차 질문 입력`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          전송
        </button>
      </div>

    </div>
  );
};

export default AiMentor;
