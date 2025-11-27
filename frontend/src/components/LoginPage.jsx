// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInStudent, signInMentor } from "../services/firebaseService";

const LoginPage = ({ onLoginSuccess }) => {
  const [role, setRole] = useState("");
  const [mentorCode, setMentorCode] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 전 사용자가 가려던 페이지 저장
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async () => {
    if (!role) {
      alert("먼저 가입 유형을 선택해주세요.");
      return;
    }

    if (role === "mentor" && mentorCode.trim() === "") {
      alert("멘토 인증코드를 입력해주세요.");
      return;
    }

    try {
      let user;

      if (role === "student") {
        user = await signInStudent();
      } else {
        user = await signInMentor(mentorCode);
      }

      // App.jsx 상태 업데이트
      onLoginSuccess(user, role);

      // 로그인 후 원래 페이지로 이동
      navigate(from, { replace: true });

    } catch (err) {
      alert(err.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary px-6 text-accent">

      {/* 타이틀 */}
      <h1 className="text-4xl font-extrabold mb-10">
        Profolio 로그인
      </h1>

      {/* 역할 선택 버튼 */}
      <div className="flex gap-6 mb-8">
        <button
          onClick={() => setRole("student")}
          className={`
            px-6 py-3 rounded-xl border-2 text-lg font-semibold transition
            ${role === "student"
              ? "bg-accent text-primary border-accent"
              : "bg-primary-light text-accent/70 border-primary-light hover:bg-primary/80"}
          `}
        >
          학생
        </button>

        <button
          onClick={() => setRole("mentor")}
          className={`
            px-6 py-3 rounded-xl border-2 text-lg font-semibold transition
            ${role === "mentor"
              ? "bg-accent text-primary border-accent"
              : "bg-primary-light text-accent/70 border-primary-light hover:bg-primary/80"}
          `}
        >
          멘토
        </button>
      </div>

      {/* 멘토 코드 입력 */}
      {role === "mentor" && (
        <input
          type="text"
          placeholder="멘토 인증코드를 입력하세요"
          className="px-4 py-2 w-72 border rounded-lg text-lg mb-6
                     bg-white/10 border-accent/40 text-accent placeholder-accent/50"
          value={mentorCode}
          onChange={(e) => setMentorCode(e.target.value)}
        />
      )}

      {/* 로그인 버튼 */}
      <button
        onClick={handleLogin}
        className="px-8 py-3 bg-accent text-primary rounded-xl text-lg font-bold shadow hover:bg-accent/90 transition"
      >
        Google 계정으로 계속하기
      </button>

    </div>
  );
};

export default LoginPage;
