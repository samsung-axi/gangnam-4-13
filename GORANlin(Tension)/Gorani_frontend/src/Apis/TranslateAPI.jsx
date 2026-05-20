import { request, withoutTokenRequest } from "./index";

export async function getTranslationResult(
  text,
  sourceLang,
  targetLang,
  model
) {
  try {
    const response = await withoutTokenRequest("POST", `/api/translation`, {
      text,
      sourceLang,
      targetLang,
      model: model
    });
    return response.data.translated_text;
  } catch (error) {
    console.error("Translation API Error:", error);
    throw error;
  }
}

// 용어집 생성 API 호출 함수
export async function createGlossary(glossary) {
  try {
    const response = await withoutTokenRequest(
      "POST",
      `/api/v1/glossary`,
      glossary
    );
    console.log("Created glossary response:", response.data); // `_id` 확인
    return response.data;
  } catch (error) {
    console.error("API 에러:", error.message);
    throw error;
  }
}

//용어집 조회
export async function fetchAllGlossaries(userId) {
  try {
    console.log(`fetchAllGlossaries for user: ${userId}`);
    const response = await withoutTokenRequest(
      "GET",
      `/api/v1/glossary?userId=${userId}`
    );

    console.log("API Response Data:", response.data); // API 응답 확인
    if (!response.data || response.data.length === 0) {
      console.warn("No glossaries returned from API");
    }

    const glossaries = response.data.map((glossary) => ({
      ...glossary,
      id: glossary._id, // `_id`를 `id`로 복사
    }));

    console.log("Processed Glossaries:", glossaries); // 처리된 용어집 데이터
    return glossaries;
  } catch (error) {
    console.error("Failed to fetch glossaries:", error);
    throw error;
  }
}

//용어집 이름 변경
export async function updateGlossaryName(id, newName) {
  try {
    const response = await withoutTokenRequest(
      "PUT",
      `/api/v1/glossary/${id}`,
      {
        name: newName, // Request Body로 전달
      }
    );
    return response.data;
  } catch (error) {
    console.error("용어집 이름 수정 에러:", error);
    throw error;
  }
}

// 용어집 삭제 API 호출 함수
export async function deleteGlossary(id) {
  try {
    const response = await withoutTokenRequest(
      "DELETE",
      `/api/v1/glossary/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("용어집 삭제 실패:", error);
    throw error;
  }
}

// 용어집 기본 설정
export async function setDefaultGlossary(userId, glossaryId) {
  try {
    console.log("Sending Request to set Default Glossary:");
    console.log("URL:", `/api/v1/glossary/${userId}/default`);
    console.log("Request Body:", { glossaryId });

    // API 요청
    const response = await request(
      "PUT",
      `/api/v1/glossary/${userId}/default`,
      { glossaryId }
    );

    // FastAPI 응답 데이터 확인
    console.log("Raw Response:", response);

    // 데이터가 이미 JSON 형식이라면 파싱 없이 그대로 반환
    return response; // 그대로 반환
  } catch (error) {
    console.error("기본 용어집 설정 실패:", error);
    throw error;
  }
}

// 단어쌍 추가 API 호출 함수
export async function addWordPair(glossaryId, wordPair) {
  try {
    const response = await withoutTokenRequest(
      "POST",
      `/api/v1/glossary/${glossaryId}/word-pair`,
      wordPair
    );

    console.log("Server response:", response.data); // 서버 응답 확인
    return response.data; // `id`가 포함된 데이터 반환
  } catch (error) {
    console.error("단어쌍 추가 실패:", error);
    throw error;
  }
}

//단어쌍 삭제
export const deleteWordPair = async (glossaryId, index) => {
  try {
    const response = await withoutTokenRequest(
      "DELETE",
      `/api/v1/glossary/${glossaryId}/word-pair/${index}`
    );
    return response.data;
  } catch (error) {
    console.error("단어쌍 삭제 실패:", error);
    throw error;
  }
};

// 단어쌍 수정 API 호출 함수
export async function updateWordPair(glossaryId, wordPairId, updatedWordPair) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await request(
      "PUT",
      `/api/v1/glossary/${glossaryId}/word-pair/${wordPairId}`,
      updatedWordPair,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰 포함
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error - Update Word Pair:", error);
    throw error;
  }
}
