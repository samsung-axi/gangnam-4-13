import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DatePickerWithRangeProps {
  date?: { from: Date; to: Date };
  setDate: (date: { from: Date; to: Date } | undefined) => void;
}

export function DatePickerWithRange({ date, setDate }: DatePickerWithRangeProps) {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fromDate = new Date(e.target.value);
    if (date?.to) {
      setDate({ from: fromDate, to: date.to });
    } else {
      setDate({ from: fromDate, to: fromDate });
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const toDate = new Date(e.target.value);
    if (date?.from) {
      setDate({ from: date.from, to: toDate });
    } else {
      setDate({ from: toDate, to: toDate });
    }
  };

  const handleClear = () => {
    setDate(undefined);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 flex-1">
        <Input
          type="date"
          value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
          onChange={handleFromChange}
          className="flex-1"
        />
        <span className="text-muted-foreground">~</span>
        <Input
          type="date"
          value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
          onChange={handleToChange}
          className="flex-1"
        />
      </div>
      {date && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          초기화
        </Button>
      )}
    </div>
  );
}
