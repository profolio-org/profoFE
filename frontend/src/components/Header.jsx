// src/components/Header.jsx
import React from "react";

const Header = ({ user, onLogin, onLogout }) => {
  return (
    <header className="w-full bg-primary text-accent py-4 px-6 flex justify-between items-center shadow-md">

      {/* 🔥 로고 */}
      <div
        className="text-2xl font-extrabold cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        Profolio
      </div>

      {/* 🔥 로그인 / 로그아웃 버튼 */}
      {!user ? (
        <button
          onClick={onLogin}
          className="
            px-5 py-2 rounded-xl 
            bg-accent text-primary font-semibold 
            shadow hover:bg-accent/80 transition
          "
        >
          로그인
        </button>
      ) : (
        <button
          onClick={onLogout}
          className="
            px-5 py-2 rounded-xl 
            bg-primary-light text-accent font-semibold 
            hover:bg-primary/80 transition
          "
        >
          로그아웃 ({user.displayName})
        </button>
      )}
    </header>
  );
};

export default Header;
