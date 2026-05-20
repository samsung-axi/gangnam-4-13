import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
          message.isUser
            ? 'bg-black text-white rounded-br-md'
            : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-md'
        }`}
      >
        <div className="text-sm leading-relaxed">
          {message.isUser ? (
            <p className="whitespace-pre-wrap">{message.text}</p>
          ) : (
            <ReactMarkdown 
              className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-headings:my-2 prose-gray"
              remarkPlugins={[remarkGfm]}
              components={{
                // 링크 스타일링
                a: ({ node, ...props }) => (
                  <a 
                    {...props} 
                    className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors duration-200" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  />
                ),
                // 코드 블록 스타일링
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <pre className="bg-gray-800 text-gray-100 p-3 rounded-lg my-2 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code 
                      className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // 인라인 코드
                inlineCode: ({ node, ...props }) => (
                  <code 
                    className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono"
                    {...props}
                  />
                ),
                // 리스트 스타일링
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc list-inside my-2 space-y-1 pl-2" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal list-inside my-2 space-y-1 pl-2" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="leading-relaxed" />
                ),
                // 강조 텍스트
                strong: ({ node, ...props }) => (
                  <strong {...props} className="font-semibold text-gray-900" />
                ),
                // 기울임 텍스트
                em: ({ node, ...props }) => (
                  <em {...props} className="italic text-gray-700" />
                ),
                // 헤딩
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-lg font-bold text-gray-900 my-2" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-base font-bold text-gray-900 my-2" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-sm font-bold text-gray-900 my-1" />
                ),
                // 문단
                p: ({ node, ...props }) => (
                  <p {...props} className="my-1 leading-relaxed text-gray-800" />
                ),
                // 인용구
                blockquote: ({ node, ...props }) => (
                  <blockquote {...props} className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600" />
                ),
                // 테이블
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-2">
                    <table {...props} className="min-w-full border-collapse border border-gray-300" />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th {...props} className="border border-gray-300 px-2 py-1 bg-gray-100 font-semibold text-left" />
                ),
                td: ({ node, ...props }) => (
                  <td {...props} className="border border-gray-300 px-2 py-1" />
                ),
                // 구분선
                hr: ({ node, ...props }) => (
                  <hr {...props} className="border-t border-gray-300 my-4" />
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          )}
        </div>
        <div className={`text-xs mt-2 ${message.isUser ? 'text-gray-300' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
