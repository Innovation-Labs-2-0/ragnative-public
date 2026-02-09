import React, { useState, createContext } from "react";
import { Card, Tabs, Tab, Box } from "@mui/material";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import MDBox from "components/style-components/MDBox";
import ChatbotConfiguration from "./ChatbotConfig";
import KnowledgeBaseSetup from "./KnowledgeBaseSetup";
import ConfigureLLM from "./ConfigureLLM";
import StyleBotPage from "./StyleBotPage";
import BotValidationPage from "./ValidationPage";
import IngestBotPage from "./IngestionPage";
import { useParams } from "react-router-dom";
import { BotContext, BotConfigTabContext } from "context/BotContext";
import PublishBot from "./PublishBot";
import { KnowledgeBaseContext } from "context/KnowledgeBaseContext";
function CreateBot() {
  const [activeTab, setActiveTab] = useState(0);
  const [maxCompletedStep, setMaxCompletedStep] = useState(0);
  const { botId, botVersion } = useParams();
  const editMode = !!botId && !!botVersion;
  const [chatbotId, setBotId] = useState(botId);
  const [chatbotVersion, setBotVersion] = useState(botVersion);
  const [kbId, setKnowledgeBaseId] = useState(null);
  const [active, setActive] = useState(true);
  const [ingestionCompleted, setIngestionComplete] = useState(false);

  const botState = {
    chatbotId,
    setBotId,
    chatbotVersion,
    setBotVersion,
    editMode,
    active,
    setActive,
    ingestionCompleted,
    setIngestionComplete,
  };
  const knowledgeBaseState = {
    kbId,
    setKnowledgeBaseId,
  };

  const handleStepComplete = (tabIndex) => {
    setMaxCompletedStep((prev) => Math.max(prev, tabIndex));
  };

  const handleNextTab = () => {
    setActiveTab((prev) => Math.min(prev + 1, 6));
  };

  const handlePreviousTab = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === activeTab) return;

    if (!isTabDisabled(newValue)) {
      setActiveTab(newValue);
    } else {
      console.log("Please complete the previous steps first");
    }
  };

  const isTabDisabled = (tabIndex) => {
    return editMode ? false : tabIndex > maxCompletedStep;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <ChatbotConfiguration
            onNext={handleNextTab}
            isActive={activeTab === 0}
            onStepComplete={() => handleStepComplete(0)}
          />
        );
      case 1:
        return (
          <KnowledgeBaseSetup
            onBack={handlePreviousTab}
            onNext={handleNextTab}
            isActive={activeTab === 1}
            onStepComplete={() => handleStepComplete(1)}
          />
        );
      case 2:
        return (
          <ConfigureLLM
            onBack={handlePreviousTab}
            onNext={handleNextTab}
            isActive={activeTab === 2}
            onStepComplete={() => handleStepComplete(2)}
          />
        );
      case 3:
        return (
          <StyleBotPage
            onBack={handlePreviousTab}
            onNext={handleNextTab}
            isActive={activeTab === 3}
            onStepComplete={() => handleStepComplete(3)}
          />
        );
      case 4:
        return (
          <BotValidationPage
            onBack={handlePreviousTab}
            onNext={handleNextTab}
            isActive={activeTab === 4}
            onStepComplete={() => handleStepComplete(4)}
          />
        );

      case 5:
        return (
          <IngestBotPage
            onBack={handlePreviousTab}
            isActive={activeTab === 5}
            onNext={handleNextTab}
          />
        );
      case 6:
        return <PublishBot onBack={handlePreviousTab} isActive={activeTab === 6} />;
      default:
        return null;
    }
  };

  return (
    <BotContext.Provider value={botState}>
      <KnowledgeBaseContext.Provider value={knowledgeBaseState}>
        <DashboardLayout>
          <DashboardNavbar routes={editMode ? ["Edit Chatbot"] : ["Create Chatbot"]} />
          <MDBox mt={1}>
            <BotConfigTabContext.Provider value={{ activeTab, setActiveTab }}>
              <Card sx={{ maxWidth: 1000, margin: "0 auto", p: 2, fontSize: "12px" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Chatbot Configuration" disabled={isTabDisabled(0)} />
                  <Tab label="Knowledge Base Setup" disabled={isTabDisabled(1)} />
                  <Tab label="LLM Configuration" disabled={isTabDisabled(2)} />
                  <Tab label="Style Your Bot" disabled={isTabDisabled(3)} />
                  <Tab label="Validate Bot" disabled={isTabDisabled(4)} />
                  <Tab label="Ingest Bot" disabled={isTabDisabled(5)} />
                  <Tab label="Try Your Bot" disabled={isTabDisabled(6) || !ingestionCompleted} />
                </Tabs>
                <Box mt={2}>{renderTabContent()}</Box>
              </Card>
            </BotConfigTabContext.Provider>
          </MDBox>
        </DashboardLayout>
      </KnowledgeBaseContext.Provider>
    </BotContext.Provider>
  );
}

export default CreateBot;
