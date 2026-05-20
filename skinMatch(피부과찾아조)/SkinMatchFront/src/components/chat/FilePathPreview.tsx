import React from 'react';
import { Image as ImageIcon, Copy, Check, FolderOpen, TerminalSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FilePathPreviewProps {
  path: string;
}

const shortenDir = (dir: string, max = 48) => {
  if (dir.length <= max) return dir;
  // Keep head and tail
  const head = dir.slice(0, Math.floor(max * 0.5)).replace(/\/$/, '');
  const tail = dir.slice(-Math.floor(max * 0.4));
  return `${head}/…/${tail.replace(/^\//, '')}`;
};

const escapeForShell = (s: string) => s.replace(/'/g, "'\\''");

const FilePathPreview: React.FC<FilePathPreviewProps> = ({ path }) => {
  const fileName = React.useMemo(() => path.split('/').pop() || path, [path]);
  const dir = React.useMemo(() => path.replace(/\/+$/, '').slice(0, path.lastIndexOf('/')) || '/', [path]);
  const ext = React.useMemo(() => (fileName.includes('.') ? fileName.split('.').pop() : '').toUpperCase(), [fileName]);

  const [copiedPath, setCopiedPath] = React.useState(false);
  const [copiedCmd, setCopiedCmd] = React.useState(false);

  const copyPath = async () => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPath(true);
      toast.success('파일 경로를 복사했어요');
      setTimeout(() => setCopiedPath(false), 1500);
    } catch {
      toast.error('경로 복사에 실패했어요');
    }
  };

  const copyOpenCmd = async () => {
    try {
      const cmd = `open '${escapeForShell(path)}'`;
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(true);
      toast.success('터미널 명령을 복사했어요');
      setTimeout(() => setCopiedCmd(false), 1500);
    } catch {
      toast.error('명령 복사에 실패했어요');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-200 bg-gray-50">
        <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center">
          <ImageIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-sm text-gray-900" title={fileName}>{fileName}</span>
            {ext && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-900 text-white">{ext}</span>
            )}
          </div>
          <div className="text-xs text-gray-600 truncate" title={dir}>{shortenDir(dir)}</div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyPath} title="경로 복사">
            {copiedPath ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyOpenCmd} title="터미널 열기 명령 복사">
            {copiedCmd ? <Check className="w-4 h-4" /> : <TerminalSquare className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div className="px-3 py-2 text-[11px] text-gray-600 flex items-center gap-2">
        <FolderOpen className="w-3.5 h-3.5" />
        <span>macOS에서: Finder → 이동(Cmd+Shift+G) → 경로 붙여넣기</span>
      </div>
    </div>
  );
};

export default FilePathPreview;

