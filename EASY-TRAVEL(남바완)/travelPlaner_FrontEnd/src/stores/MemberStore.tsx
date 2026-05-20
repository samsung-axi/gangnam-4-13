import { create } from "zustand";
import { persist } from "zustand/middleware";

// 디코드된 토큰 interface
interface MemberInfo {
  nickname: string;
  email: string;
  profile_url?: string;
  roles?: string[];
}

// 스토어 객체 interface
interface MemberStore {
  memberInfo: MemberInfo;
  getMemberInfo: () => MemberInfo;
  setMemberInfo: (memberInfo: MemberInfo) => void;
  // 익명 사용자 여부 확인
  isAnonymous: () => boolean;
  // 관리자 여부 확인
  isAdmin: () => boolean;
  initMemberInfo: () => void;
}

const useMemberStore: any = create(
  persist<MemberStore>(
    (set, get) => ({
      memberInfo: {
        nickname: "익명의 사용자",
        email: "",
        profile_url: "",
        roles: [],
      },
      getMemberInfo: () => get().memberInfo,
      setMemberInfo: (newMemberInfo: MemberInfo) =>
        set({ memberInfo: newMemberInfo }),

      initMemberInfo: () => {
        set({
          memberInfo: {
            nickname: "익명의 사용자",
            email: "",
            profile_url: "",
            roles: [],
          },
        });
        localStorage.removeItem("memberInfo");
      },

      isAnonymous: () => {
        const state = get();
        const isAnon = state.memberInfo?.nickname === "익명의 사용자" || false;
        if (!isAnon) {
          console.log("회원 정보:", state.memberInfo);
        }
        return isAnon;
      },

      isAdmin: () => {
        const state = get();
  console.log("역할:", state.memberInfo?.roles);
  return state.memberInfo?.roles?.includes("ROLE_ADMIN") || false;
        
      },
    }),
    {
      name: "memberInfo",
    }
  )
);
export default useMemberStore;
