import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface Document {
  title: string;
  similarity_score: number;
  relevance_reason: string;
  download_url?: string;
}

// interface RecommendResponse {
//     success: boolean;
//     message?: string;
//     documents: Document[];
// }

const Container = styled.div`
  height: 100vh;
  background-color: #f7f7f7;
  padding: 2rem;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  input {
    flex: 1;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  button {
    padding: 1rem 2rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #2563eb;
    }

    &:disabled {
      background-color: #94a3b8;
      cursor: not-allowed;
    }
  }
`;

const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const DocumentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }

  .similarity {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background-color: #e0f2fe;
    color: #0369a1;
    border-radius: 999px;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .preview {
    color: #64748b;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .download-link {
    display: inline-block;
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  max-width: 800px;
  margin: 1rem auto;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 8px;
  color: #dc2626;
  text-align: center;
`;

const DocumentRecommend: React.FC = () => {
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<any>(
        `${import.meta.env.VITE_API_URL}/api/v1/docs/recommend`,
        { query },
        { withCredentials: true }
      );

      if (response.data && Array.isArray(response.data.documents)) {
        setDocuments(response.data.documents);
      } else {
        setError(response.data.message || '문서 검색 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버 연결 중 오류가 발생했습니다.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <MainContent>
        <SearchContainer>
          <SearchInput>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="역할 또는 업무 내용을 입력하세요"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={loading}>
              {loading ? '검색 중...' : '검색'}
            </button>
          </SearchInput>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <DocumentsGrid>
            {documents.map((doc) => (
              <DocumentCard>
                <h2>{doc.title}</h2>
                <div className="similarity">
                  유사도: {(doc.similarity_score * 100).toFixed(1)}%
                </div>
                <p className="preview">{doc.relevance_reason}</p>
                {doc.download_url && (
                  <a
                    href={doc.download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    문서 다운로드 →
                  </a>
                )}
              </DocumentCard>
            ))}
          </DocumentsGrid>
        </SearchContainer>
      </MainContent>
    </Container>
  );
};

export default DocumentRecommend;
