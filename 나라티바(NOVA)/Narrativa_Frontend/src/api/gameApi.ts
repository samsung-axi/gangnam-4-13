import axiosInstance from "./axiosInstance";

interface GenerateStoryParams {
  genre: string;
  affection: number;
  cut: number;
  userInput: string;
}

export const generateStory = async (params: GenerateStoryParams) => {
  console.log(
    "Request URL:",
    `${axiosInstance.defaults.baseURL}/api/generate-story`
  ); // 디버깅용 로그
  try {
    const response = await axiosInstance.post("/api/generate-story", params);
    return response.data; // 서버에서 반환된 데이터
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
};
