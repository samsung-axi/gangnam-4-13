// ✅ hooks/usePlacementHistory.js
// ✅ 작성자: 김태원
// ✅ 기능 요약: AI 배치 결과에 대한 상태 히스토리를 Redis에 저장/되돌리기 위한 커스텀 훅

import { useState } from "react";
import {
  pushPlacementState,
  undoPlacementState,
  redoPlacementState,
  getCurrentPlacementState,
  clearPlacementSession,
} from "@/api/redis";

/**
 * ✅ Redis 기반 Undo/Redo/SaveState 기능을 제공하는 커스텀 훅
 * - AI 결과를 히스토리로 관리
 * - 캔버스 및 미리보기 동기화에 활용
 *
 * @param {object} sessionIdRef - useRef로 관리되는 세션 ID 참조값
 */
export const usePlacementHistory = (sessionIdRef) => {
  // 🔸 현재 이미지(base64)를 로컬 state로 관리 (프론트 동기화용)
  const [currentImage, setCurrentImage] = useState(null);

  // 🔹 최신 sessionId를 항상 안전하게 가져오는 함수
  const getSessionId = () => {
    if (!sessionIdRef?.current) {
      sessionIdRef.current = crypto.randomUUID();
    }
    return sessionIdRef.current;
  };

  /**
   * ✅ 상태 저장 함수 (최신 base64 이미지 Redis에 push)
   * @param {string} base64Image - 저장할 이미지 데이터
   */
  const saveState = async (base64Image) => {
    const sid = getSessionId();
    if (!sid) {
      console.error("❌ sessionId가 없어 상태를 저장할 수 없습니다!");
      return;
    }

    try {
      // ⚙️ 인자 순서: (sessionId, payload)
      await pushPlacementState(base64Image,sid);

      // 🔸 프론트 미리보기용 state 업데이트
      setCurrentImage(base64Image);
    } catch (err) {
      console.error("상태 저장 실패:", err);
    }
  };

  /**
   * ✅ 이전 상태로 되돌리기 (Undo)
   * @returns {string|null} - 이전 상태 이미지(base64) 반환
   */
  const undo = async () => {
    const sid = getSessionId();
    if (!sid) return null;

    try {
      const prevImage = await undoPlacementState(sid); // Redis에서 pop
      if (prevImage) setCurrentImage(prevImage);
      return prevImage;
    } catch (err) {
      console.error("undo 실패:", err);
      return null;
    }
  };

  /**
   * ✅ 다음 상태로 다시 실행 (Redo)
   * @returns {string|null} - 다음 상태 이미지(base64) 반환
   */
  const redo = async () => {
    const sid = getSessionId();
    if (!sid) return null;

    try {
      const nextImage = await redoPlacementState(sid); // Redis에서 forward
      if (nextImage) setCurrentImage(nextImage);
      return nextImage;
    } catch (err) {
      console.error("redo 실패:", err);
      return null;
    }
  };

  /**
   * ✅ 현재 상태 불러오기 (앱 로드시 동기화용)
   */
  const loadCurrent = async () => {
    const sid = getSessionId();
    if (!sid) return;

    try {
      const current = await getCurrentPlacementState(sid); // Redis에서 peek
      if (current) setCurrentImage(current);
    } catch (err) {
      console.error("현재 상태 로드 실패:", err);
    }
  };

  /**
   * 🧹 현재 세션의 히스토리 전체 삭제
   */
  const clearHistory = async () => {
    const sid = getSessionId();
    if (!sid) return;

    try {
      await clearPlacementSession(sid);
      setCurrentImage(null); // 프론트 상태도 초기화
    } catch (err) {
      console.error("히스토리 삭제 실패:", err);
    }
  };

  // 🔹 외부에서 사용할 함수들 리턴
  return {
    currentImage,  // 프론트에서 현재 상태 미리보기에 활용 가능
    saveState,
    undo,
    redo,
    loadCurrent,
    clearHistory,
  };
};
