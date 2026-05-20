import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface ChatResponse {
  message: string;
  keywords: {
    직무_키워드: string[];
    기술_자격_키워드: string[];
    선호도_키워드: string[];
    제약사항_키워드: string[];
  };
  embeddings: number[];
}

export const chatService = {
  async sendMessage(message: string, model_name: string = "phi4"): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { 
        message,
        model_name
      });
      return response.data;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw error;
    }
  },

  async resetChat(model_name: string = "phi4"): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/chat/reset`, { model_name });
    } catch (error) {
      console.error('Reset Chat Error:', error);
      throw error;
    }
  }
}; 