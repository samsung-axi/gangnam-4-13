import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Companion {
  label: string;
  count: number;
}

interface PlanState {
  main_location: string;
  name: string;
  start_date: string;
  end_date: string;
  ages: string;
  companion_count: Companion[];
  concepts: string[];
  // 상태 조회 및 수정을 위한 메서드들
  getPlan: () => Omit<
    PlanState,
    "getPlan" | "setPlan" | "resetPlan" | "initPlanInfo"
  >;
  setPlan: (plan: Partial<PlanState>) => void;
  resetPlan: () => void;
  initPlanInfo: () => void;
}

const initialState = {
  main_location: "",
  name: "새로운 일정",
  start_date: "",
  end_date: "",
  ages: "",
  companion_count: [],
  concepts: [],
};

const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      ...initialState,
      // 현재 계획 정보를 가져오는 메서드
      getPlan: () => {
        const state = get();
        const { getPlan, setPlan, resetPlan, initPlanInfo, ...planInfo } =
          state;
        return planInfo;
      },
      setPlan: (plan) => set((state) => ({ ...state, ...plan })),
      // 상태만 초기화
      resetPlan: () => set(initialState),
      // 상태와 로컬스토리지 모두 초기화
      initPlanInfo: () => {
        set(initialState);
        localStorage.removeItem("planStorage");
      },
    }),
    {
      name: "planStorage",
    }
  )
);

export default usePlanStore;
