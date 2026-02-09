import { ReactComponent as OpenAIBlack } from "assets/providers/openai-black.svg";
import { ReactComponent as OpenAIWhite } from "assets/providers/openai-white.svg";
import { useTheme } from "@mui/material/styles";
import { ReactComponent as AnthropicIcon } from "assets/providers/anthropic.svg";
import { ReactComponent as GeminiIcon } from "assets/providers/gemini.svg";
import { ReactComponent as AzureIcon } from "assets/providers/azure-openai.svg";
import MemoryIcon from "@mui/icons-material/Memory";

const OpenAIIcon = () => {
  const theme = useTheme();

  return theme.palette.mode === "dark" ? (
    <OpenAIWhite style={{ width: 26, height: 28 }} />
  ) : (
    <OpenAIBlack style={{ width: 26, height: 28 }} />
  );
};

const PROVIDER_ICON_MAP = {
  openai: <OpenAIIcon />,
  anthropic: <AnthropicIcon style={{ width: 26, height: 28 }} />,
  gemini: <GeminiIcon style={{ width: 26, height: 28 }} />,
  "azure openai": <AzureIcon style={{ width: 26, height: 28 }} />,
  default: <MemoryIcon color="secondary" fontSize="medium" />,
};

export default PROVIDER_ICON_MAP;
