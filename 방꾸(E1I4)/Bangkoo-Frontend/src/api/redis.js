// api/redis.js
// 작성자: 김태원
// Redis 기반 상태 히스토리 관리 API

import api from "./axios";

/**
 * 📌 현재 상태 저장 (undo stack에 push)
 * @param {string} base64 - base64 문자열
 * @param {string} sessionId - 작업 세션 구분자
 */
export async function pushPlacementState(base64, sessionId) {
  return await api.post(`/api/redis/state?sessionId=${sessionId}`, base64, {
    headers: {
      "Content-Type": "text/plain", // base64는 text로 보내는 게 안정적
    },
  });
}

/**
 * 🔙 되돌리기 (undo)
 * @param {string} sessionId
 */
export async function undoPlacementState(sessionId) {
  const response = await api.post(`/api/redis/undo?sessionId=${sessionId}`);
  return response.data;
}

/**
 * 🔁 다시 실행 (redo)
 * @param {string} sessionId
 */
export async function redoPlacementState(sessionId) {
  const response = await api.post(`/api/redis/redo?sessionId=${sessionId}`);
  return response.data;
}

/**
 * 📂 현재 상태 조회
 * @param {string} sessionId
 */
export async function getCurrentPlacementState(sessionId) {
  const response = await api.get(`/api/redis/state?sessionId=${sessionId}`);
  return response.data;
}

/**
 * 🧹 세션별 히스토리 삭제
 * @param {string} sessionId - 삭제할 세션 ID
 */
export async function clearPlacementSession(sessionId) {
  return await api.delete(`/api/redis/clear?sessionId=${sessionId}`);
}