export async function sendChatMessage(query: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/chatbot/chat/0.0.1`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }
  );

  if (!res.ok) throw new Error("서버 오류");
  return res.json(); // { type: 'scenario' | 'ai', response: string }
}
