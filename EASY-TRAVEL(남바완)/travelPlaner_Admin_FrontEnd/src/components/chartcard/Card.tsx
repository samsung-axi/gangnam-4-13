import React from 'react';
import { MemberChart } from '../memberchart/MemberChart';
import { AgentChart } from '../chart/Chart';
import styles from './Card.module.scss'

interface CardProps {
  type: 'member' | 'agent';
  agentName?: string;
  title: string;
  className?: string;  // className을 선택적 prop으로 추가
}


export const Card: React.FC<CardProps> = ({ type, agentName, title }) => {
  return (
    <div className={styles.chartcard_container}>
      <div className={styles.chart_container}>
        <div className={styles.chart_content}>
        {type === 'member' 
  ? <MemberChart /> 
  : (agentName ? <AgentChart agentName={agentName} /> : null)
}
        </div>
      </div>
      <div className={styles.chartcard_title_container}>
        <h2>{title}</h2>
      </div>
    </div>
  );
}
