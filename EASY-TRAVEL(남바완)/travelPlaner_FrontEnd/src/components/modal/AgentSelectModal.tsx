import React, { useState } from "react";
import styles from "./AgentSelectModal.module.css";
import LongBtn from "../buttons/LongBtn";

interface AgentSelectModalProps {
  isOpen: boolean;
  onSelect: (agentType: string[]) => void;
}

const AgentSelectModal: React.FC<AgentSelectModalProps> = ({
  isOpen,
  onSelect,
}) => {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAgentClick = (agentType: string) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentType)) {
        return prev.filter((type) => type !== agentType);
      } else {
        return [...prev, agentType];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(selectedAgents);
  };

  const agents = [
    { type: "cafe", name: "카페 에이전트", icon: "/icons/cafe_agent.jpg" },
    {
      type: "restaurant",
      name: "맛집 에이전트",
      icon: "/icons/restaurant_agent.jpg",
    },
    { type: "site", name: "관광지 에이전트", icon: "/icons/site_agent.jpg" },
    {
      type: "accommodation",
      name: "숙소 에이전트",
      icon: "/icons/accommodation_agent.jpg",
    },
  ];

  return (
    <form className={styles.modal_overlay} onSubmit={handleSubmit}>
      <div className={styles.modal_container}>
        <h2>어떤 에이전트의 도움을 받으시겠어요?</h2>
        <div className={styles.agent_grid}>
          {agents.map((agent) => (
            <div
              key={agent.type}
              className={`${styles.agent_card} ${
                selectedAgents.includes(agent.type) ? styles.selected : ""
              }`}
              onClick={() => handleAgentClick(agent.type)}
            >
              <div className={styles.agent_icon}>
                <img src={agent.icon} alt={agent.name} />
              </div>
              <h3>{agent.name}</h3>
            </div>
          ))}
        </div>
        <div className={styles.button_container}>
          <LongBtn type="submit" content="선택 완료" />
        </div>
      </div>
    </form>
  );
};

export default AgentSelectModal;
