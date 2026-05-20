import api from "../../api/axios";

export const saveSearchLog = (userId, query, source = "text") => {
  return api.post("/api/search-logs", null, {
    params: { userId, query, source }
  });
};
