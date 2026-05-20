import axios from 'axios';
import { API_BASE_URL } from "../config";

export const fetchChartData = async () => {
  const response = await axios.get(`${API_BASE_URL}/agents/admin/metrics`);
  return response.data;
};
