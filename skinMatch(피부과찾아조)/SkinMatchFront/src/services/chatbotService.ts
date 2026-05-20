const CHATBOT_API_BASE_URL = import.meta.env.VITE_CHATBOT_API_BASE_URL || 'http://localhost:8003';

export interface ConsultStartResponse {
  session_id: string;
  reply?: string;
}

export const chatbotService = {
  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${CHATBOT_API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  async startConsult(analysis: any, firstMessage?: string): Promise<ConsultStartResponse> {
    const body = { analysis, message: firstMessage };
    const res = await fetch(`${CHATBOT_API_BASE_URL}/api/v1/consult/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to start consult');
    return res.json();
  },

  async sendMessage(sessionId: string, message: string): Promise<{ session_id: string; reply: string }> {
    const res = await fetch(`${CHATBOT_API_BASE_URL}/api/v1/consult/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },
};

export default chatbotService;

