/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F192F",        // 메인 컬러
        "primary-light": "#1A2A45", // 메인보다 밝은 네이비 (사이드바, 버튼 비활성 등에 사용)
        accent: "#E7CFA6",         // 서브 골드 컬러
      },
      keyframes: {
        shimmer: {
          "0%": { opacity: 0.4 },
          "50%": { opacity: 1 },
          "100%": { opacity: 0.4 },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-ai": "linear-gradient(90deg,#6366f1,#8b5cf6,#6366f1)",
      },
    },
  },
  plugins: [],
};




