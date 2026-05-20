import React from "react";
import styled from "styled-components";
import AddVoiceFileIcon from "/images/addvoicefile.svg";

const InputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: transparent;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 1rem;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

// 허용된 오디오 파일 형식
const ALLOWED_AUDIO_FORMATS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];

// 파일 형식 검증 함수
const isValidAudioFile = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split('.').pop();
  return fileExtension ? ALLOWED_AUDIO_FORMATS.includes(fileExtension) : false;
};

interface FileUploadProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ setFile, setError }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      
      // 파일 형식 검증
      if (!isValidAudioFile(selectedFile)) {
        setError('파일형식이 알맞지 않습니다');
        return;
      }
      
      setFile(selectedFile);
      setError(''); // 성공 시 에러 메시지 초기화
    }
  };

  return (
    <div>
      <InputLabel htmlFor="file-upload">
        <img src={AddVoiceFileIcon} alt="파일 선택" />
      </InputLabel>
      <HiddenInput
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        accept=".flac,.m4a,.mp3,.mp4,.mpeg,.mpga,.oga,.ogg,.wav,.webm"
      />
    </div>
  );
};

export default FileUpload;
