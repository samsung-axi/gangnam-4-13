import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-top: 2rem;
  color: #000;
`;

const Box = styled.div`
  width: 90%;
  min-height: 100px;
  border: 2px solid #ccc;
  border-radius: 12px;
  margin: 1rem 0;
  background-color: #ffffff;
  padding: 1rem;
  box-sizing: border-box;
  max-height: 300px;
  overflow-y: auto;
  color: #000;
`;

const LinkItem = styled.a`
  display: block;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ResultContents: React.FC<{ result: any }> = ({ result }) => {
  // 실제 데이터가 있는 경로로 콘솔 로그 추가
  const assignedRoles = result?.tagging?.assigned_roles?.assigned_roles?.assigned_todos;
  const feedback = result?.tagging?.feedback?.feedback;
  const summary = result?.tagging?.summary?.agent_output;
  console.log('tagging:', result?.tagging);
  console.log('assignedRoles:', assignedRoles);
  console.log('feedback:', feedback);
  console.log('summary:', summary);
  if (!result) return null;

  return (
    <Wrapper>
      <div style={{ fontWeight: 'bold', fontSize: '1.2em', margin: '1.5em 0 0.5em 0' }}>요약</div>
      <Box>
        {summary
          ? Object.entries(summary).map(([key, arr]: [string, any]) => (
              <div key={key} style={{ marginBottom: '0.7em' }}>
                <strong>{key}</strong>
                <ul style={{ margin: '0.2em 0 0.2em 1.2em', padding: 0 }}>
                  {Array.isArray(arr) ? arr.map((item: any, idx: number) => (
                    <li key={idx} style={{ listStyle: 'disc', marginLeft: '1em', marginBottom: '0.2em' }}>{item}</li>
                  )) : <li>{arr}</li>}
                </ul>
              </div>
            ))
          : '요약 정보가 없습니다.'}
      </Box>
      <div style={{ fontWeight: 'bold', fontSize: '1.2em', margin: '1.5em 0 0.5em 0' }}>역할분담</div>
      <Box>
        {Array.isArray(assignedRoles) && assignedRoles.length > 0
          ? (
            <ul style={{ margin: 0, padding: 0 }}>
              {assignedRoles.map((todo: any, idx: number) => (
                <li key={idx} style={{ marginBottom: '0.3em', marginLeft: '1em' }}>
                  <strong>{todo.assignee}</strong> : {todo.action}
                  {todo.schedule && todo.schedule.trim() !== ''
                    ? <span style={{ color: '#007bff', marginLeft: '0.5em' }}>[예상 일정: {todo.schedule}]</span>
                    : <span style={{ color: '#aaa', marginLeft: '0.5em' }}>[예상 일정: 미정]</span>
                  }
                  {todo.context && <span style={{ color: '#555' }}> ({todo.context})</span>}
                </li>
              ))}
            </ul>
          )
          : '역할 정보가 없습니다.'
        }
      </Box>
      <div style={{ fontWeight: 'bold', fontSize: '1.2em', margin: '1.5em 0 0.5em 0' }}>피드백</div>
      <Box>
        {feedback
          ? Object.entries(feedback).map(([key, value]: [string, any]) => (
              <div key={key} style={{ marginBottom: '0.7em' }}>
                <strong>{key}</strong>
                <div style={{ marginLeft: '1em', whiteSpace: 'pre-line' }}>
                  {Array.isArray(value)
                    ? (
                      <ul style={{ margin: 0, padding: 0 }}>
                        {value.map((item: any, idx: number) => (
                          <li key={idx} style={{ listStyle: 'circle', marginLeft: '1em', marginBottom: '0.2em' }}>{item}</li>
                        ))}
                      </ul>
                    )
                    : value}
                </div>
              </div>
            ))
          : '피드백이 없습니다.'}
      </Box>
      추천 문서
      <Box>
        {Array.isArray(result.search_result) &&
        result.search_result.length > 0 ? (
          result.search_result.map((url: string, index: number) => (
            <LinkItem
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 관련 문서 {index + 1}.{url}
            </LinkItem>
          ))
        ) : (
          <div>추천 문서가 없습니다.</div>
        )}
      </Box>
    </Wrapper>
  );
};

export default ResultContents;
