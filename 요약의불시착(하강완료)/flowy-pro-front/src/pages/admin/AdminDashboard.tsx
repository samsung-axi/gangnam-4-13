import { useMemo, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  fetchDashboardStats,
  fetchDashboardFilterOptions,
} from '../../api/fetchDashboard';
import type {
  DashboardResponse,
  FilterOptions,
  TableData,
  DashboardSummary,
} from '../../types/dashboard';

const DashboardContainer = styled.div`
  padding: 40px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  min-height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(
      135deg,
      rgba(53, 23, 69, 0.05) 0%,
      rgba(53, 23, 69, 0.02) 30%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #351745 0%, #4a1168 50%, #351745 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #351745 0%, #4a1168 100%);
    border-radius: 2px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ $isActive?: boolean }>`
  padding: 8px 16px;
  background: ${(props) =>
    props.$isActive
      ? 'linear-gradient(135deg, #351745 0%, #4a1168 100%)'
      : '#f5f5f5'};
  color: ${(props) => (props.$isActive ? '#fff' : '#666')};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:first-child {
    border-radius: 4px 0 0 4px;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }

  &:hover {
    background: ${(props) =>
      props.$isActive
        ? 'linear-gradient(135deg, #351745 0%, #4a1168 100%)'
        : '#e0e0e0'};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
  background: #fff;
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FilterModeSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const FilterModeLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #351745;
  margin-bottom: 12px;
`;

const FilterModeGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const FilterModeOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;

  input[type='radio'] {
    margin: 0;
    accent-color: #351745;
  }

  &:hover {
    color: #351745;
  }
`;

const FilterControlsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const FilterSelect = styled.div`
  position: relative;
  min-width: 200px;
`;

const SelectLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #351745;
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }
`;

const DateRangeInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  text-align: right;
`;

const DateRangeLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #351745;
  text-align: right;
`;

const DateRangeButton = styled.div`
  color: #555;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-align: right;
  padding: 2px 0;
  border-radius: 4px;

  &:hover {
    color: #351745;
    background: rgba(53, 23, 69, 0.05);
    padding: 2px 8px;
  }
`;

// Main Content Container (Summary + Feedback 좌우 배열)
const MainContentContainer = styled.div`
  display: flex;
  gap: 24px;
  height: calc(100vh - 400px); /* 헤더, 필터 등을 제외한 높이 */
  min-height: 600px;

  @media (max-width: 1400px) {
    flex-direction: column;
    height: auto;
  }
`;

// Summary Section (좌측, 1/4 비율)
const SummarySection = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px 20px 24px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  @media (max-width: 1400px) {
    flex: none;
    margin-bottom: 24px;
  }
`;

const SummaryTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 0;
  color: #351745;
  text-align: left;
`;

const SummaryGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;

const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
  flex: 1;
  min-height: 0;
  height: 100%;
`;

const SummaryCardTitle = styled.h3`
  font-size: 14px;
  color: #666;
  margin: 0 0 6px 0;
  background-color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 14px;
  display: inline-block;
  text-align: center;
  align-self: center;
  flex-shrink: 0;
`;

const SummaryCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  height: 100%;
`;

const ComparisonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex: 1;
  padding: 8px;
  text-align: center;
`;

const ComparisonItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ComparisonValue = styled.div<{ $isPrimary?: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => (props.$isPrimary ? '#351745' : '#666')};
  margin-bottom: 2px;
  line-height: 1.2;
`;

const ComparisonLabel = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.2;
`;

// Feedback Section (우측, 3/4 비율)
const FeedbackSection = styled.div`
  flex: 3;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  @media (max-width: 1400px) {
    flex: none;
  }
`;

const FeedbackTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 0;
  color: #351745;
  text-align: left;
`;

// const FeedbackSubTitle = styled.div`
//   display: inline-block;
//   background: #f5f3f8;
//   color: #351745;
//   font-size: 15px;
//   font-weight: 700;
//   padding: 8px 32px;
//   border-radius: 32px;
//   text-align: center;
//   margin-bottom: 2px;
// `;

// 피드백 유형 필터 스타일
const FeedbackFilterSection = styled.div`
  margin: 16px 0;
`;

const FeedbackFilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const FeedbackFilterLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #351745;
`;

const FeedbackTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
`;

const FeedbackTypeCheckbox = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$isSelected ? '#351745' : '#e0e0e0')};
  background: ${(props) => (props.$isSelected ? '#f8f5ff' : '#fff')};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #351745;
    background: #f8f5ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(53, 23, 69, 0.1);
  }
`;

const CheckboxInput = styled.input`
  display: none;
`;

const CustomCheckbox = styled.div<{ $isChecked?: boolean }>`
  width: 16px;
  height: 16px;
  border: 2px solid ${(props) => (props.$isChecked ? '#351745' : '#ccc')};
  border-radius: 3px;
  background: ${(props) =>
    props.$isChecked
      ? 'linear-gradient(135deg, #351745 0%, #4a1168 100%)'
      : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '✓';
    color: white;
    font-size: 10px;
    font-weight: bold;
    opacity: ${(props) => (props.$isChecked ? 1 : 0)};
    transition: opacity 0.2s ease;
  }
`;

const CheckboxLabel = styled.label`
  font-size: 13px;
  color: #333;
  cursor: pointer;
  margin: 0;
  flex: 1;
  line-height: 1.3;
`;

const SelectAllButton = styled.button`
  background: linear-gradient(135deg, #351745 0%, #4a1168 100%);
  border: none;
  color: white;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(53, 23, 69, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(53, 23, 69, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 피드백 콘텐츠 좌우 배열 컨테이너
const FeedbackContent = styled.div`
  display: flex;
  gap: 24px;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const ChartContainer = styled.div`
  flex: 1;
  height: 100%;
  min-width: 0;
`;

// 테이블 스타일링
const TableContainer = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  min-width: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const Th = styled.th`
  padding: 8px 12px;
  text-align: left;
  background-color: #f8f6fa;
  color: #351745;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 1;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  font-size: 14px;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f6fa;
  }
`;

type PeriodType = 'year' | 'quarter' | 'month' | 'week' | 'day';

// 날짜 선택 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 420px;
  max-width: 480px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Rethink Sans', sans-serif;
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #351745;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Rethink Sans', sans-serif;
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
`;

const DateInputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const DateLabel = styled.label`
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
  font-family: 'Rethink Sans', sans-serif;
  text-align: center;
`;

const DateInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  font-family: 'Rethink Sans', sans-serif;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #351745;
    box-shadow: 0 0 0 2px rgba(53, 23, 69, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled.button<{ $isPrimary?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Rethink Sans', sans-serif;

  ${(props) =>
    props.$isPrimary
      ? `
    background: linear-gradient(135deg, #351745 0%, #4a1168 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #4a1168 0%, #5d2b7a 100%);
    }
  `
      : `
    background: #f5f5f5;
    color: #666;
    
    &:hover {
      background: #e0e0e0;
    }
  `}
`;

// const SelectedDateRange = styled.div`
//   font-size: 12px;
//   color: #666;
//   margin-top: 8px;
//   text-align: center;
//   font-family: 'Rethink Sans', sans-serif;
// `;

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // period에 따른 기본 날짜 범위 계산 함수
  const getDefaultDateRange = useCallback((period: PeriodType) => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];

    const startDate = new Date(today);
    switch (period) {
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate,
    };
  }, []);

  const [startDate, setStartDate] = useState(() => {
    const { startDate } = getDefaultDateRange('month');
    return startDate;
  });
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // API 데이터 상태
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 조회 방식 상태 - 'project' 또는 'department'
  const [filterMode, setFilterMode] = useState<'project' | 'department'>(
    'department'
  );

  // 필터 상태 - 기본값 "전체"
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');

  // 피드백 유형 필터 상태
  const [selectedFeedbackTypes, setSelectedFeedbackTypes] = useState<string[]>(
    []
  );

  // 대시보드 데이터 로드 - 계층적 필터링 적용
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        period: selectedPeriod,
        start_date: startDate,
        end_date: endDate,
      };

      // 조회 방식에 따른 필터링 적용
      if (filterMode === 'project') {
        // 프로젝트별 조회
        if (selectedProject) {
          params.project_id = selectedProject;
          console.log('▶ 대시보드 데이터 요청 (프로젝트별 조회):', params);
        }
        if (selectedUser) {
          params.user_id = selectedUser;
          console.log('▶ 대시보드 데이터 요청 (프로젝트별 + 사용자):', params);
        }
      } else {
        // 부서별 조회
        if (selectedDepartment) {
          params.department = selectedDepartment;
          console.log('▶ 대시보드 데이터 요청 (부서별 조회):', params);
        }
        if (selectedUser) {
          params.user_id = selectedUser;
          console.log('▶ 대시보드 데이터 요청 (부서별 + 사용자):', params);
        }
      }

      const data: DashboardResponse = await fetchDashboardStats(params);
      setDashboardData(data);
      console.log('▶ 대시보드 데이터 응답:', data);

      // 백엔드에서 auto_department가 반환된 경우 부서 필터를 자동으로 업데이트
      if (data.auto_department && filterMode === 'department' && !selectedDepartment) {
        console.log('▶ 자동 부서 설정:', data.auto_department);
        setSelectedDepartment(data.auto_department);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '데이터 로드에 실패했습니다.'
      );
      console.error('대시보드 데이터 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [
    selectedPeriod,
    startDate,
    endDate,
    filterMode,
    selectedProject,
    selectedDepartment,
    selectedUser,
  ]);

  // 필터 옵션 로드 - 계층적 필터링을 위해 파라미터 전달
  const loadFilterOptions = useCallback(async () => {
    try {
      setFilterLoading(true);
      const params: any = {
        start_date: startDate,
        end_date: endDate,
      };

      // 조회 방식에 따른 필터 옵션 로드
      if (filterMode === 'project') {
        if (selectedProject) {
          params.project_id = selectedProject;
          console.log('▶ 필터 옵션 요청 (프로젝트별 조회):', params);
        }
      } else {
        if (selectedDepartment) {
          params.department = selectedDepartment;
          console.log('▶ 필터 옵션 요청 (부서별 조회):', params);
        }
      }

      const options: FilterOptions = await fetchDashboardFilterOptions(params);
      setFilterOptions(options);
      console.log('▶ 초기 필터 옵션 응답:', options);
    } catch (err) {
      console.error('초기 필터 옵션 로드 오류:', err);
    } finally {
      setFilterLoading(false);
    }
  }, [filterMode, selectedProject, selectedDepartment, startDate, endDate]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    // 초기 period에 맞는 날짜 범위 설정
    const { startDate: initialStartDate, endDate: initialEndDate } =
      getDefaultDateRange(selectedPeriod);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);

    loadFilterOptions();
    loadDashboardData();
  }, []);

  // period 변경 시 날짜 범위 의존성 추가
  useEffect(() => {
    // 초기 로딩이 아닌 경우에만 대시보드 데이터 갱신
    if (dashboardData !== null) {
      loadDashboardData();
    }
  }, [
    filterMode,
    selectedProject,
    selectedDepartment,
    selectedUser,
    selectedPeriod,
    startDate,
    endDate,
  ]);

  // 날짜 범위 변경 시 필터 옵션도 다시 로드
  useEffect(() => {
    if (dashboardData !== null) {
      loadFilterOptions();
    }
  }, [startDate, endDate, loadFilterOptions]);

  // 조회 방식 변경 핸들러
  const handleFilterModeChange = useCallback(
    (mode: 'project' | 'department') => {
      console.log('▶ 조회 방식 변경:', mode);
      setFilterMode(mode);

      // 조회 방식 변경 시 모든 필터 초기화
      setSelectedProject('');
      setSelectedDepartment('');
      setSelectedUser('');

      // 필터 옵션 다시 로드
      loadFilterOptions();
    },
    [loadFilterOptions]
  );

  // 필터 변경 핸들러 - 조회 방식에 따른 연동 로직 구현
  const handleProjectChange = useCallback(
    async (projectId: string) => {
      console.log('▶ 프로젝트 선택 값:', projectId);
      setSelectedProject(projectId);

      // 프로젝트 변경 시 사용자 초기화
      setSelectedUser('');

      // 프로젝트 선택 시 해당 프로젝트에 참여하는 사용자만 가져오기
      try {
        setFilterLoading(true);
        const params: any = {
          start_date: startDate,
          end_date: endDate,
        };
        if (projectId) {
          params.project_id = projectId;
          console.log('▶ 프로젝트 기반 필터 옵션 요청:', params);
        }
        const options: FilterOptions = await fetchDashboardFilterOptions(
          params
        );
        setFilterOptions(options);
        console.log('▶ 프로젝트 기반 필터 옵션 응답:', options);
      } catch (err) {
        console.error('프로젝트 기반 필터 옵션 갱신 오류:', err);
      } finally {
        setFilterLoading(false);
      }
    },
    [startDate, endDate]
  );

  const handleDepartmentChange = useCallback(
    async (department: string) => {
      console.log('▶ 부서 선택 값:', department);
      setSelectedDepartment(department);

      // 부서 변경 시 사용자 초기화
      setSelectedUser('');

      // 부서 선택 시 해당 부서의 사용자만 가져오기
      try {
        setFilterLoading(true);
        const params: any = {
          start_date: startDate,
          end_date: endDate,
        };
        if (department) {
          params.department = department;
          console.log('▶ 부서 기반 필터 옵션 요청:', params);
        }
        const options: FilterOptions = await fetchDashboardFilterOptions(
          params
        );
        setFilterOptions(options);
        console.log('▶ 부서 기반 필터 옵션 응답:', options);
      } catch (err) {
        console.error('부서 기반 필터 옵션 갱신 오류:', err);
      } finally {
        setFilterLoading(false);
      }
    },
    [startDate, endDate]
  );

  const handleUserChange = useCallback(
    async (userId: string) => {
      console.log('▶ 사용자 선택 값:', userId);
      setSelectedUser(userId);

      // 사용자 선택 시 부서별 조회 모드에서만 해당 사용자의 부서로 자동 변경
      if (userId && filterOptions && filterMode === 'department') {
        const selectedUserInfo = filterOptions.users.find(
          (user) => user.id === userId
        );
        if (selectedUserInfo && selectedUserInfo.department) {
          console.log('▶ 사용자 부서 자동 선택:', selectedUserInfo.department);
          setSelectedDepartment(selectedUserInfo.department);
        }
      } else if (!userId) {
        // 사용자 선택 해제 시 필터 옵션을 다시 로드하여 전체 사용자 목록 갱신
        try {
          setFilterLoading(true);
          const params: any = {
            start_date: startDate,
            end_date: endDate,
          };

          // 조회 방식에 따라 필터 적용
          if (filterMode === 'project' && selectedProject) {
            params.project_id = selectedProject;
          } else if (filterMode === 'department' && selectedDepartment) {
            params.department = selectedDepartment;
          }

          const options: FilterOptions = await fetchDashboardFilterOptions(
            params
          );
          setFilterOptions(options);
          console.log('▶ 사용자 선택 해제 후 필터 옵션 갱신:', options);
        } catch (err) {
          console.error('사용자 선택 해제 후 필터 옵션 갱신 오류:', err);
        } finally {
          setFilterLoading(false);
        }
      }
    },
    [
      filterOptions,
      filterMode,
      selectedProject,
      selectedDepartment,
      startDate,
      endDate,
    ]
  );

  const handlePeriodChange = useCallback(
    (period: PeriodType) => {
      console.log('▶ 기간 선택 값:', period);
      setSelectedPeriod(period);

      // period 변경 시 날짜 범위도 자동으로 업데이트
      const { startDate: newStartDate, endDate: newEndDate } =
        getDefaultDateRange(period);
      setStartDate(newStartDate);
      setEndDate(newEndDate);

      console.log(
        `▶ 기간 변경에 따른 날짜 범위 업데이트: ${newStartDate} ~ ${newEndDate}`
      );

      // 기간 변경 시 로딩 상태 표시
      setLoading(true);
    },
    [getDefaultDateRange]
  );

  // 기간별 레이블 매핑
  const periodLabels: Record<PeriodType, string> = useMemo(
    () => ({
      year: 'Year',
      quarter: 'Quarter',
      month: 'Month',
      week: 'Week',
      day: 'Day',
    }),
    []
  );

  // 기간 타입 배열을 안전하게 생성
  const periodTypes: PeriodType[] = useMemo(
    () => ['year', 'quarter', 'month', 'week', 'day'],
    []
  );

  // 테이블 컬럼 설정
  const columnHelper = useMemo(() => createColumnHelper<TableData>(), []);
  const columns = useMemo(
    () => [
      columnHelper.accessor('period', {
        header: 'Period',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('feedback_type', {
        header: '피드백 항목',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('filtered_avg', {
        header: '조회 평균',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('pop', {
        header: 'PoP',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('total_avg', {
        header: '전체 평균',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('vs_total', {
        header: '전체 대비',
        cell: (info) => info.getValue(),
      }),
    ],
    [columnHelper]
  );

  // 피드백 유형별 테이블 데이터 필터링
  const filteredTableData = useMemo(() => {
    if (!dashboardData) return [];

    let data = dashboardData.tableData;

    // 선택된 피드백 유형이 있으면 필터링
    if (selectedFeedbackTypes.length > 0) {
      data = data.filter((item) =>
        selectedFeedbackTypes.includes(item.feedback_type)
      );
    }

    return data;
  }, [dashboardData, selectedFeedbackTypes]);

  const table = useReactTable({
    data: filteredTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 피드백 유형별 차트 데이터 변환
  const chartDataByPeriod = useMemo(() => {
    if (!dashboardData) return [];

    const dataByPeriod: Record<string, Record<string, number>> = {};

    // 선택된 기간의 데이터만 필터링
    let filteredData = dashboardData.chartData.filter(
      (data) => data.period === selectedPeriod
    );

    // 선택된 피드백 유형이 있으면 추가 필터링
    if (selectedFeedbackTypes.length > 0) {
      filteredData = filteredData.filter((data) =>
        selectedFeedbackTypes.includes(data.feedback_type)
      );
    }

    // 기간별로 피드백 유형 데이터 그룹화
    filteredData.forEach((item) => {
      if (!dataByPeriod[item.year]) {
        dataByPeriod[item.year] = {};
      }
      dataByPeriod[item.year][item.feedback_type] = item.count;
    });

    // 차트 데이터 형식으로 변환
    return Object.entries(dataByPeriod).map(([year, feedbackTypes]) => ({
      year,
      ...feedbackTypes,
    }));
  }, [dashboardData, selectedPeriod, selectedFeedbackTypes]);

  // 고유한 피드백 유형들 추출
  const feedbackTypes = useMemo(() => {
    if (!dashboardData) return [];
    const types = new Set(
      dashboardData.chartData.map((item) => item.feedback_type)
    );
    return Array.from(types);
  }, [dashboardData]);

  // 차트에 표시할 피드백 유형들 (선택된 것들 또는 전체)
  const displayedFeedbackTypes = useMemo(() => {
    return selectedFeedbackTypes.length > 0
      ? selectedFeedbackTypes
      : feedbackTypes;
  }, [selectedFeedbackTypes, feedbackTypes]);

  // 피드백 유형별 색상 정의
  const feedbackColors = useMemo(() => {
    const colors = [
      '#351745',
      '#8884d8',
      '#82ca9d',
      '#ffc658',
      '#ff7c7c',
      '#8dd1e1',
      '#d084d0',
      '#ffb347',
      '#87ceeb',
      '#dda0dd',
    ];
    const colorMap: Record<string, string> = {};
    feedbackTypes.forEach((type, index) => {
      colorMap[type] = colors[index % colors.length];
    });
    return colorMap;
  }, [feedbackTypes]);

  // 차트 컴포넌트 메모이제이션
  const chartComponent = useMemo(
    () => (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartDataByPeriod}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            label={{ value: '건수', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `${value}건`}
            domain={[0, 'dataMax']}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value, name) => [`${value}건`, name]}
            labelFormatter={(label) => `기간: ${label}`}
          />
          {displayedFeedbackTypes.map((feedbackType) => (
            <Line
              key={feedbackType}
              type="monotone"
              dataKey={feedbackType}
              stroke={feedbackColors[feedbackType]}
              strokeWidth={2}
              dot={{ fill: feedbackColors[feedbackType] }}
              name={feedbackType}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    ),
    [chartDataByPeriod, displayedFeedbackTypes, feedbackColors]
  );

  // 모달 열기
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // 모달 닫기
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // 날짜 적용
  const handleApplyDateRange = useCallback(() => {
    // 날짜 범위가 변경되면 데이터를 다시 로드
    loadDashboardData();
    setIsModalOpen(false);
  }, [loadDashboardData]);

  // 날짜 형식 변환 함수
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // 피드백 유형 선택 핸들러
  const handleFeedbackTypeChange = useCallback((feedbackType: string) => {
    setSelectedFeedbackTypes((prev) => {
      if (prev.includes(feedbackType)) {
        // 이미 선택된 경우 제거
        return prev.filter((type) => type !== feedbackType);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, feedbackType];
      }
    });
  }, []);

  // 전체 선택/해제 핸들러
  const handleSelectAllFeedbackTypes = useCallback(() => {
    if (selectedFeedbackTypes.length === feedbackTypes.length) {
      // 모두 선택된 경우 전체 해제
      setSelectedFeedbackTypes([]);
    } else {
      // 일부만 선택된 경우 전체 선택
      setSelectedFeedbackTypes([...feedbackTypes]);
    }
  }, [selectedFeedbackTypes, feedbackTypes]);

  // 로딩 상태 표시
  if (loading) {
    return (
      <DashboardContainer>
        <PageTitle>대시보드</PageTitle>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          데이터를 불러오는 중...
        </div>
      </DashboardContainer>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <DashboardContainer>
        <PageTitle>대시보드</PageTitle>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          오류: {error}
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <PageTitle>대시보드</PageTitle>

      <TabContainer>
        {periodTypes.map((period) => (
          <Tab
            key={period}
            $isActive={selectedPeriod === period}
            onClick={() => handlePeriodChange(period)}
          >
            {periodLabels[period]}
          </Tab>
        ))}
      </TabContainer>

      <FilterSection>
        {/* 조회 방식 선택 */}
        <FilterModeSection>
          <FilterModeLabel>조회 방식 선택</FilterModeLabel>
          <FilterModeGroup>
            <FilterModeOption>
              <input
                type="radio"
                name="filterMode"
                value="department"
                checked={filterMode === 'department'}
                onChange={(e) =>
                  handleFilterModeChange(e.target.value as 'department')
                }
              />
              부서별 조회
            </FilterModeOption>
            <FilterModeOption>
              <input
                type="radio"
                name="filterMode"
                value="project"
                checked={filterMode === 'project'}
                onChange={(e) =>
                  handleFilterModeChange(e.target.value as 'project')
                }
              />
              프로젝트별 조회
            </FilterModeOption>
          </FilterModeGroup>
        </FilterModeSection>

        {/* 필터 컨트롤 */}
        <FilterControlsSection>
          <FilterGroup>
            {filterMode === 'project' ? (
              // 프로젝트별 조회 필터
              <>
                <FilterSelect>
                  <SelectLabel>프로젝트 선택</SelectLabel>
                  <Select
                    value={selectedProject}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    disabled={filterLoading}
                  >
                    <option value="">전체 프로젝트</option>
                    {filterOptions?.projects?.map(
                      (project: { id: string; name: string }) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      )
                    )}
                  </Select>
                  {filterLoading && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '4px',
                      }}
                    >
                      로딩 중...
                    </div>
                  )}
                </FilterSelect>

                <FilterSelect>
                  <SelectLabel>사용자 선택</SelectLabel>
                  <Select
                    value={selectedUser}
                    onChange={(e) => handleUserChange(e.target.value)}
                    disabled={filterLoading}
                  >
                    <option value="">전체 사용자</option>
                    {filterOptions?.users?.map(
                      (user: {
                        id: string;
                        name: string;
                        login_id: string;
                      }) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.login_id})
                        </option>
                      )
                    )}
                  </Select>
                  {filterLoading && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '4px',
                      }}
                    >
                      로딩 중...
                    </div>
                  )}
                </FilterSelect>
              </>
            ) : (
              // 부서별 조회 필터
              <>
                <FilterSelect>
                  <SelectLabel>부서 선택</SelectLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    disabled={filterLoading}
                  >
                    <option value="">전체 부서</option>
                    {filterOptions?.departments?.map((dept: string) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Select>
                  {filterLoading && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '4px',
                      }}
                    >
                      로딩 중...
                    </div>
                  )}
                </FilterSelect>

                <FilterSelect>
                  <SelectLabel>사용자 선택</SelectLabel>
                  <Select
                    value={selectedUser}
                    onChange={(e) => handleUserChange(e.target.value)}
                    disabled={filterLoading}
                  >
                    <option value="">전체 사용자</option>
                    {filterOptions?.users?.map(
                      (user: {
                        id: string;
                        name: string;
                        login_id: string;
                      }) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.login_id})
                        </option>
                      )
                    )}
                  </Select>
                  {filterLoading && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '4px',
                      }}
                    >
                      로딩 중...
                    </div>
                  )}
                </FilterSelect>
              </>
            )}
          </FilterGroup>

          <DateRangeInfo>
            <DateRangeLabel>조회 기간 설정</DateRangeLabel>
            <DateRangeButton onClick={handleOpenModal}>
              {formatDate(startDate)} ~ {formatDate(endDate)}
            </DateRangeButton>
          </DateRangeInfo>
        </FilterControlsSection>
      </FilterSection>

      {/* 날짜 선택 모달 */}
      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>조회 기간 설정</ModalTitle>

            <DateRangeContainer>
              <DateInputGroup>
                <DateLabel>시작일</DateLabel>
                <DateInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                />
              </DateInputGroup>
              <DateInputGroup>
                <DateLabel>종료일</DateLabel>
                <DateInput
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </DateInputGroup>
            </DateRangeContainer>

            <ButtonGroup>
              <ModalButton onClick={handleCloseModal}>취소</ModalButton>
              <ModalButton $isPrimary onClick={handleApplyDateRange}>
                적용
              </ModalButton>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

      <MainContentContainer>
        <SummarySection>
          <SummaryTitle>Summary</SummaryTitle>
          <SummaryGrid>
            {dashboardData?.summary.map((item: DashboardSummary) => (
              <SummaryCard key={item.title}>
                <SummaryCardTitle>{item.title}</SummaryCardTitle>
                <SummaryCardContent>
                  <div style={{ flex: '1.2', height: '100%', minHeight: 100 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: item.labelTarget,
                            value: item.target,
                            fill: item.color,
                          },
                          {
                            name: item.labelAvg,
                            value: item.average,
                            fill: item.colorAvg,
                          },
                        ]}
                        barCategoryGap={30}
                        maxBarSize={35}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, textAnchor: 'middle' }}
                        />
                        <YAxis domain={[0, item.yMax]} hide />
                        <Tooltip formatter={(v) => `${v}${item.unit}`} />
                        <Bar
                          dataKey="value"
                          radius={[6, 6, 0, 0]}
                          isAnimationActive={false}
                        >
                          {[
                            {
                              name: item.labelTarget,
                              value: item.target,
                              fill: item.color,
                            },
                            {
                              name: item.labelAvg,
                              value: item.average,
                              fill: item.colorAvg,
                            },
                          ].map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <ComparisonContainer>
                    <ComparisonItem>
                      <ComparisonValue $isPrimary>
                        {item.target}
                        {item.unit}
                      </ComparisonValue>
                      <ComparisonLabel>{item.labelTarget}</ComparisonLabel>
                    </ComparisonItem>
                    <ComparisonItem>
                      <ComparisonValue>
                        {item.average}
                        {item.unit}
                      </ComparisonValue>
                      <ComparisonLabel>{item.labelAvg}</ComparisonLabel>
                    </ComparisonItem>
                  </ComparisonContainer>
                </SummaryCardContent>
              </SummaryCard>
            ))}
          </SummaryGrid>
        </SummarySection>

        <FeedbackSection>
          <FeedbackTitle>Feedback</FeedbackTitle>

          {/* 피드백 유형 선택 필터 */}
          <FeedbackFilterSection>
            <FeedbackFilterHeader>
              <FeedbackFilterLabel>피드백 유형 선택</FeedbackFilterLabel>
              <SelectAllButton onClick={handleSelectAllFeedbackTypes}>
                {selectedFeedbackTypes.length === feedbackTypes.length
                  ? '전체 해제'
                  : '전체 선택'}
              </SelectAllButton>
            </FeedbackFilterHeader>
            <FeedbackTypeGrid>
              {feedbackTypes.map((feedbackType) => (
                <FeedbackTypeCheckbox
                  key={feedbackType}
                  $isSelected={selectedFeedbackTypes.includes(feedbackType)}
                  onClick={() => handleFeedbackTypeChange(feedbackType)}
                >
                  <CheckboxInput
                    type="checkbox"
                    checked={selectedFeedbackTypes.includes(feedbackType)}
                    onChange={() => handleFeedbackTypeChange(feedbackType)}
                  />
                  <CustomCheckbox
                    $isChecked={selectedFeedbackTypes.includes(feedbackType)}
                  />
                  <CheckboxLabel>{feedbackType}</CheckboxLabel>
                </FeedbackTypeCheckbox>
              ))}
            </FeedbackTypeGrid>
          </FeedbackFilterSection>

          <FeedbackContent>
            <ChartContainer>{chartComponent}</ChartContainer>
            <TableContainer>
              <Table>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <Td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </FeedbackContent>
        </FeedbackSection>
      </MainContentContainer>
    </DashboardContainer>
  );
};

export default AdminDashboard;
