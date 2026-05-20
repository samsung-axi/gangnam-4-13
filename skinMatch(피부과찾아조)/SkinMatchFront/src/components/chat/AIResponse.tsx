import React from 'react';
import { Bot, Copy, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MarkdownMessage from '@/components/chat/MarkdownMessage';
import { toast } from 'sonner';
import FilePathPreview from '@/components/chat/FilePathPreview';

interface AIResponseProps {
  content: string;
}

const AIResponse: React.FC<AIResponseProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);
  const stripInvisible = (str: string) =>
    str
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
      .replace(/[\u202A-\u202E\u2066-\u2069]/g, '');

  // Detect one or more macOS-like absolute image file paths in content (allow spaces, exclude quotes/newlines)
  const { paths } = React.useMemo(() => {
    const base = stripInvisible(content);
    // Match quoted/unquoted macOS paths, optionally prefixed with file://
    const pathRegex = /['"]?(?:file:\/\/)?(\/(?:[^'"\r\n]+\/)*[^'"\r\n]+\.(?:png|jpe?g|gif|webp|heic))['"]?/gi;
    const found = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = pathRegex.exec(base)) !== null) {
      if (m[1]) found.add(m[1]);
    }
    return { paths: Array.from(found) };
  }, [content]);

  // Replace detected paths in the content with markdown links to file:// URLs
  const linkedContent = React.useMemo(() => {
    const base = stripInvisible(content);
    if (!paths.length) return base;
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let out = base;
    paths.forEach((p) => {
      const encoded = 'file://' + encodeURI(p);
      const re = new RegExp(escapeRegex(p), 'g');
      out = out.replace(re, `[${p}](${encoded})`);
    });
    return out;
  }, [content, paths]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('응답을 복사했어요');
      const t = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(t);
    } catch {
      toast.error('복사에 실패했어요');
    }
  };

  return (
    <div className="relative group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-gray-700">AI 응답</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-600 hover:text-black" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      <div className="p-3 text-sm text-gray-800 space-y-3">
        {paths.length > 0 && (
          <div className="space-y-2">
            {paths.map((p) => (
              <FilePathPreview key={p} path={p} />
            ))}
          </div>
        )}
        {linkedContent && <MarkdownMessage content={linkedContent} />}
      </div>

      <div className="px-3 pb-3 -mt-1 text-[11px] text-gray-500 flex items-center gap-1">
        <Info className="w-3.5 h-3.5" />
        <span>의료 정보는 참고용입니다. 전문의 상담을 권장해요.</span>
      </div>

      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-indigo-400" />
    </div>
  );
};

export default AIResponse;
