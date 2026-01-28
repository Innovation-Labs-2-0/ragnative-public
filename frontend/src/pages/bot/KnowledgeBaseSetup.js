import React from "react";
import PropTypes from "prop-types";
import KnowledgeBaseForm from "components/Forms/KnowledgeBaseForm";
import { useBotContext } from "context/BotContext";
import { useKnowledgeBaseContext } from "context/KnowledgeBaseContext";

function KnowledgeBaseSetup({ onBack, onNext, isActive, onStepComplete }) {
  const { chatbotId } = useBotContext();
  const { kbId: knowledgeBaseId, setKnowledgeBaseId } = useKnowledgeBaseContext();
  const handleSaveSuccess = (savedKbId) => {
    if (savedKbId !== knowledgeBaseId) {
      setKnowledgeBaseId(savedKbId);
    }
    onStepComplete();
  };

  const mode = knowledgeBaseId ? "edit" : "create";

  return (
    <KnowledgeBaseForm
      mode={mode}
      botId={chatbotId}
      onSaveSuccess={handleSaveSuccess}
      onBack={onBack}
      onNext={onNext}
      onStepComplete={onStepComplete}
      isActive={isActive}
    />
  );
}

KnowledgeBaseSetup.propTypes = {
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onStepComplete: PropTypes.func,
  isActive: PropTypes.any,
};

export default KnowledgeBaseSetup;
