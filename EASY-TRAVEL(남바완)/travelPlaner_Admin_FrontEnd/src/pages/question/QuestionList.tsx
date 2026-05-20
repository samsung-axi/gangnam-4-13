import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from "./QuestionList.module.scss";
import { API_BASE_URL } from "../../config";

interface Question {
  inquiry_id: number;
  title: string;
  created_at: string;
  answer: boolean;
}

function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // 오전/오후 처리
    const ampm = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12; // 12시간제로 변환

    return `${year}/${month}/${day
      .toString()
      }`;
  };


  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/inquiries/admin/all`);

      console.log("백엔드에서 받은 응답:", response.data);

      if (response.data && response.data.data && Array.isArray(response.data.data.inquiries)) {
        setQuestions(response.data.data.inquiries);
      } else {
        console.error("응답 데이터 형식이 올바르지 않습니다:", response.data);
        setQuestions([]); 
      }
    } catch (error) {
      console.error("Axios 요청 실패:", error);
      setQuestions([]);
    }
  };

  return (
    <div className={styles.question_list_container}>
      <div className={styles.question_list_content_container}>
        <div className={styles.question_list_title_container}>
          <h1 className={styles.question_list_title}>문의 내역</h1>
        </div>
        <div className={styles.question_list_main_content_container}>
          <table className={styles.question_table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Title</th>
                <th>Date</th>
                <th>Ans</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(questions) && questions.length > 0 ? (
                questions.map((question) => (
                  <tr key={question.inquiry_id}>
                    <td>{question.inquiry_id}</td>
                    <td className={styles["title-cell"]}>
                      <Link
                        to={`/admin/question/${question.inquiry_id}`}
                        className={styles["title-link"]}
                      >
                        {question.title}
                      </Link>
                    </td>
                    <td>{formatDateTime(question.created_at)}</td>
                    <td>{question.answer ? "완료" : "미답변"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    문의 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default QuestionList;
