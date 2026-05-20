import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../../api/fetchChatbot';
import {
  Container,
  Header,
  Title,
  Subtitle,
  ChatContainer,
  KeywordContainer,
  KeywordButton,
  Messages,
  MessageBubble,
  LoadingDots,
  LoadingDot,
  LinkButton,
  InputArea,
  Input,
  SendButton,
  MessageContent,
  MessageSection,
  MessageLabel,
  MessageText
} from './ChatBot.styles';

type Message = {
  sender: 'user' | 'bot';
  text?: string;
  doc?: string;
  link?: string;
  summary?: string;
  loading?: boolean; // 로딩 표시용 플래그
};

const LoadingDotsComponent: React.FC = () => {
  return (
    <LoadingDots>
      <LoadingDot />
      <LoadingDot />
      <LoadingDot />
    </LoadingDots>
  );
};

const Chatbot: React.FC = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: '안녕하세요, 저는 플로위 AI 챗봇이에요.\n무엇을 원하시나요? 제가 도와드릴게요.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const keywords = ['로그인', '회의 분석', '아이디찾기', '비밀번호 찾기'];

  const handleQuickSubmit = async (keyword: string) => {
    if (loading) return;

    // 유저 메시지 추가
    const userMsg: Message = { sender: 'user', text: keyword };
    setMessages((prev) => [...prev, userMsg]);

    // 로딩 메시지 추가
    const loadingMsg: Message = { sender: 'bot', loading: true };
    setMessages((prev) => [...prev, loadingMsg]);
    setLoading(true);

    try {
      const res = await sendChatMessage(keyword);
      const cleaned = res.replace(/```json\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(cleaned);
      const result = parsed.results?.[0];
      const summary = parsed.llm_summary || '';

      let botMsg: Message;

      if (result) {
        const doc = result.document || '문서 없음';
        let link = result.metadata?.link || '';

        if (link.startsWith('http:') && !link.startsWith('http://')) {
          link = link.replace(/^http:/, 'http://');
        }

        botMsg = {
          sender: 'bot',
          doc,
          link,
          summary,
        };
      } else if (summary) {
        botMsg = {
          sender: 'bot',
          summary,
        };
      } else {
        throw new Error('결과가 완전히 비어 있습니다.');
      }

      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.loading);
        return [...filtered, botMsg];
      });
    } catch (err) {
      console.error('에러 발생:', err);
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.loading);
        return [
          ...filtered,
          {
            sender: 'bot',
            text: '❗ 결과를 이해하지 못했어요. JSON 파싱에 실패했거나 예상치 못한 형식이에요.',
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // 유저 메시지 추가
    const userMsg: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // 로딩 메시지 추가
    const loadingMsg: Message = { sender: 'bot', loading: true };
    setMessages((prev) => [...prev, loadingMsg]);
    setLoading(true);

    try {
      const res = await sendChatMessage(input);
      const cleaned = res.replace(/```json\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(cleaned);
      const result = parsed.results?.[0];
      const summary = parsed.llm_summary || '';

      let botMsg: Message;

      if (result) {
        const doc = result.document || '문서 없음';
        let link = result.metadata?.link || '';

        if (link.startsWith('http:') && !link.startsWith('http://')) {
          link = link.replace(/^http:/, 'http://');
        }

        botMsg = {
          sender: 'bot',
          doc,
          link,
          summary,
        };
      } else if (summary) {
        // 🔸 결과는 없지만 요약이 존재하는 경우
        botMsg = {
          sender: 'bot',
          summary,
        };
      } else {
        // 🔸 아무것도 없을 경우
        throw new Error('결과가 완전히 비어 있습니다.');
      }

      // 로딩 메시지 제거 후 봇 메시지 추가
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.loading);
        return [...filtered, botMsg];
      });
    } catch (err) {
      console.error('에러 발생:', err);
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.loading);
        return [
          ...filtered,
          {
            sender: 'bot',
            text: '❗ 결과를 이해하지 못했어요. JSON 파싱에 실패했거나 예상치 못한 형식이에요.',
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <Container>
      <Header>
        <Title>플로위 AI 챗봇</Title>
        <Subtitle>무엇을 도와드릴까요?</Subtitle>
      </Header>
      
      <ChatContainer>
        <KeywordContainer>
          {keywords.map((kw, i) => (
            <KeywordButton
              key={i}
              onClick={() => {
                handleQuickSubmit(kw);
              }}
            >
              {kw}
            </KeywordButton>
          ))}
        </KeywordContainer>

        <Messages>
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';

            // 로딩 메시지일 경우 점 애니메이션 표시
            if (msg.loading) {
              return (
                <MessageBubble key={idx} isUser={false}>
                  <MessageContent>
                    <span>챗봇 응답 중</span>
                    <LoadingDotsComponent />
                  </MessageContent>
                </MessageBubble>
              );
            }

            return (
              <MessageBubble key={idx} isUser={isUser}>
                {isUser ? (
                  <MessageText>{msg.text}</MessageText>
                ) : (
                  <MessageContent>
                    {msg.doc && (
                      <MessageSection>
                        <MessageLabel>📄 안내</MessageLabel>
                        <MessageText>{msg.doc}</MessageText>
                      </MessageSection>
                    )}
                    {msg.summary && (
                      <MessageSection>
                        <MessageLabel>📝 챗봇 응답</MessageLabel>
                        <MessageText>{msg.summary}</MessageText>
                      </MessageSection>
                    )}
                    {msg.link && (
                      <LinkButton onClick={() => window.open(msg.link, '_blank')}>
                        링크 열기
                      </LinkButton>
                    )}
                    {msg.text && (
                      <MessageSection>
                        <MessageText>
                          {msg.text
                            .split('\n')
                            .map((line, i) => <div key={i}>{line}</div>)}
                        </MessageText>
                      </MessageSection>
                    )}
                  </MessageContent>
                )}
              </MessageBubble>
            );
          })}
          <div ref={bottomRef} />
        </Messages>

        <InputArea onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={loading}
          />
          <SendButton type="submit" disabled={loading}>
            {loading ? '전송 중...' : '전송'}
          </SendButton>
        </InputArea>
      </ChatContainer>
    </Container>
  );
};

export default Chatbot;
