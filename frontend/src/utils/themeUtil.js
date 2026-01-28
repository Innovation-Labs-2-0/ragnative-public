import { useMaterialUIController } from "context";

export const isDarkMode = () => {
  const [controller, dispatch] = useMaterialUIController();
  return controller.darkMode;
};
