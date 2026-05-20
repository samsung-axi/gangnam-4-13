import axios from 'axios';
import { API_BASE_URL } from "../config";

export const fetchMemberChartData = async () => {
  const response = await axios.get(`${API_BASE_URL}/members/admin/all`);
  return response.data;
};
