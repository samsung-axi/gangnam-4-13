import React, { useState } from 'react';
import styled from 'styled-components';

interface EditEventPopProps {
  type: 'todo' | 'meeting';
  event: {
    id: string;
    title: string;
    start: Date | string;
    end?: Date | string;
    completed?: boolean;
    comment?: string;
    meeting_id?: string;
  };
  onSave: (id: string, completed: boolean, meeting_id?: string) => void;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;
const PopContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  min-width: 500px;
  max-width: 500px;
  padding: 32px 28px 24px 28px;
  box-shadow: 0 4px 24px rgba(80, 0, 80, 0.13);
  position: relative;
`;
const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #351745;
  margin-bottom: 18px;
`;
const Label = styled.label`
  font-weight: 600;
  min-width: 80px;
  max-width: 120px;
  text-align: right;
  margin-right: 8px;
  @media (max-width: 600px) {
    text-align: left;
    margin-right: 0;
    margin-bottom: 2px;
  }
`;
const Input = styled.input`
  flex: 1 1 0;
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #c7b8d9;
  border-radius: 6px;
  font-size: 1rem;
`;
const Textarea = styled.textarea`
  flex: 1 1 0;
  width: 100%;
  min-height: 60px;
  padding: 8px 10px;
  border: 1px solid #c7b8d9;
  border-radius: 6px;
  font-size: 1rem;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }
`;
const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
const Button = styled.button`
      background: linear-gradient(135deg, #351745 0%, #4a1168 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  padding: 8px 24px;
  cursor: pointer;
  &:hover {
    background: #4b2067;
  }
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
`;

// 오전/오후 옵션
const ampmOptions = [
  { label: '오전', value: 'AM' },
  { label: '오후', value: 'PM' },
];
// 시/분 옵션
const hourOptions = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);
const minuteOptions = ['00', '10', '20', '30', '40', '50'];

// 24시간제 -> 오전/오후+시+분 분리 함수
function parseTime24(t: string) {
  if (!t) return { ampm: 'AM', hour: '12', min: '00' };
  const [h, m] = t.split(':').map(Number);
  const ampm = h < 12 ? 'AM' : 'PM';
  let hour = h % 12;
  if (hour === 0) hour = 12;
  return {
    ampm,
    hour: String(hour).padStart(2, '0'),
    min: String(m).padStart(2, '0'),
  };
}
// 오전/오후+시+분 -> 24시간제 변환 함수
function to24Hour(ampm: string, hour: string, min: string) {
  let h = Number(hour);
  if (ampm === 'AM' && h === 12) h = 0;
  else if (ampm === 'PM' && h !== 12) h += 12;
  return `${String(h).padStart(2, '0')}:${min}`;
}

const EditEventPop: React.FC<EditEventPopProps> = ({
  type,
  event,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(
    typeof event.start === 'string'
      ? event.start.slice(0, 10)
      : event.start.toISOString().slice(0, 10)
  );
  const [startTime, setStartTime] = useState(
    event.start
      ? typeof event.start === 'string' && event.start.length > 10
        ? event.start.slice(11, 16)
        : ''
      : ''
  );
  const [endTime, setEndTime] = useState(
    event.end
      ? typeof event.end === 'string' && event.end.length > 10
        ? event.end.slice(11, 16)
        : ''
      : ''
  );
  const [completed /*, setCompleted*/] = useState(!!event.completed);
  const [comment, setComment] = useState(event.comment || '');

  const startParsed = parseTime24(startTime);
  const endParsed = parseTime24(endTime);

  return (
    <Overlay onClick={onClose}>
      <PopContainer onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={onClose}>닫기 ✕</CloseBtn>
        <Title>{type === 'meeting' ? '회의 수정' : '할 일 수정'}</Title>
        <Row>
          <Label>제목</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Row>
        <Row>
          <Label>일자</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Row>
        {type === 'meeting' && (
          <>
            <Row>
              <Label>시작 시간</Label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <select
                  value={startParsed.ampm}
                  onChange={(e) => {
                    const v = to24Hour(
                      e.target.value,
                      startParsed.hour,
                      startParsed.min
                    );
                    setStartTime(v);
                  }}
                  style={{
                    width: 60,
                    padding: '8px 4px',
                    border: '1px solid #c7b8d9',
                    borderRadius: 6,
                    fontSize: '1rem',
                  }}
                >
                  {ampmOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <select
                  value={startParsed.hour}
                  onChange={(e) => {
                    const v = to24Hour(
                      startParsed.ampm,
                      e.target.value,
                      startParsed.min
                    );
                    setStartTime(v);
                  }}
                  style={{
                    width: 60,
                    padding: '8px 4px',
                    border: '1px solid #c7b8d9',
                    borderRadius: 6,
                    fontSize: '1rem',
                  }}
                >
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span style={{ alignSelf: 'center' }}>:</span>
                <select
                  value={startParsed.min}
                  onChange={(e) => {
                    const v = to24Hour(
                      startParsed.ampm,
                      startParsed.hour,
                      e.target.value
                    );
                    setStartTime(v);
                  }}
                  style={{
                    width: 60,
                    padding: '8px 4px',
                    border: '1px solid #c7b8d9',
                    borderRadius: 6,
                    fontSize: '1rem',
                  }}
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </Row>
            <Row>
              <Label>종료 시간</Label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <select
                  value={endParsed.ampm}
                  onChange={(e) => {
                    const v = to24Hour(
                      e.target.value,
                      endParsed.hour,
                      endParsed.min
                    );
                    setEndTime(v);
                  }}
                  style={{
                    width: 60,
                    padding: '8px 4px',
                    border: '1px solid #c7b8d9',
                    borderRadius: 6,
                    fontSize: '1rem',
                  }}
                >
                  {ampmOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <select
                  value={endParsed.hour}
                  onChange={(e) => {
                    const v = to24Hour(
                      endParsed.ampm,
                      e.target.value,
                      endParsed.min
                    );
                    setEndTime(v);
                  }}
                  style={{
                    width: 60,
                    padding: '8px 4px',
                    border: '1px solid #c7b8d9',
                    borderRadius: 6,
                    fontSize: '1rem',
                  }}
                >
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span style={{ alignSelf: 'center' }}>:</span>
                <select
                  value={endParsed.min}
                  onChange={(e) => {
                    const v = to24Hour(
                      endParsed.ampm,
                      endParsed.hour,
                      e.target.value
                    );
                    setEndTime(v);
                  }}
                  style={{
                    width: 60,
                    padding: '8px 4px',
                    border: '1px solid #c7b8d9',
                    borderRadius: 6,
                    fontSize: '1rem',
                  }}
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </Row>
          </>
        )}
        <Row>
          <Label>코멘트/설명</Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="메모, 설명, 코멘트 등 입력"
          />
        </Row>
        <BtnRow>
          <Button onClick={() => onSave(event.id, completed, event.meeting_id)}>저장</Button>
          <Button style={{ background: '#aaa' }} onClick={onClose}>
            닫기
          </Button>
        </BtnRow>
      </PopContainer>
    </Overlay>
  );
};

export default EditEventPop;
