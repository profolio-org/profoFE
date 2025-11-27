// src/services/openaiService.js
export const askOpenAI = async (prompt) => {
  try {
    const res = await fetch("http://localhost:5001/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    return data.answer;
  } catch (err) {
    console.error("AI 요청 오류:", err);
    return "AI 응답 중 오류가 발생했습니다.";
  }
};
