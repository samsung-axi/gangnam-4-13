import axios from "axios";

export const statisticsService = {
  incrementTraffic: async () => {
    try {
      if (!process.env.REACT_APP_SPRING_URI) {
        console.error('REACT_APP_SPRING_URI가 설정되지 않았습니다');
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_SPRING_URI}/api/admin/stats/increment-traffic`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('트래픽 측정 실패:', error);
    }
  }
};