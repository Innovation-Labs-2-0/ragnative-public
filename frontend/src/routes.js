import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Page404 from "pages/page404";
import Profile from "./pages/Profile/Profile";

// @mui icons
import Icon from "@mui/material/Icon";
import SourceIcon from "@mui/icons-material/Source";
import PersonIcon from "@mui/icons-material/Person";
import RegisterLLMs from "pages/llms/RegisterLLMs";
import DocPreview from "pages/bot/FileViewer";
import CreateBot from "pages/bot/CreateBot";
import Publish from "pages/bot/PublishBot";
import UsersList from "pages/admin/UsersList";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ManageTeams from "pages/admin/ManageTeams";
import KnowledgeBases from "pages/knowledge_base/KnowledgeBaseList";
import ManageLLMs from "pages/llms/ManageLLMs";
import ManageBots from "pages/bot/ManageBots";
import ViewKnowledgeBase from "pages/knowledge_base/ViewEditKnowledgeBase";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    name: "My Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },

  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },

  {
    type: "collapse",
    name: "Page 404",
    key: "page404",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/page404",
    component: <Page404 />,
  },
  {
    name: "Register LLMs",
    key: "register-llms",
    route: "/register-llms",
    component: <RegisterLLMs />,
  },

  {
    name: "Create Bot",
    key: "create-bot",
    icon: <Icon fontSize="small">add_circle_outline</Icon>,
    route: "/create-bot",
    component: <CreateBot />,
  },
  {
    name: "Edit Bot",
    key: "edit-bot",
    route: "/edit-bot/:botId/version/:botVersion",
    component: <CreateBot />,
  },
  {
    type: "collapse",
    name: "Admin",
    key: "admin",
    icon: <PersonIcon fontSize="small" />,
    collapse: [
      {
        name: "Users",
        key: "users",
        icon: <SupervisorAccountIcon fontSize="small" />,

        route: "/users",
        component: <UsersList />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Knowledge Bases",
    key: "knowledge-bases",
    icon: <Icon fontSize="small">menu_book</Icon>,
    route: "/knowledge-bases",
    component: <KnowledgeBases />,
  },
  {
    type: "logout",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/sign-in",
  },
  {
    name: "Try Bot",
    key: "publish-bot",
    route: "/publish-bot/:botId/version/:botVersion",
    component: <Publish />,
  },
  {
    type: "collapse",
    name: "Teams",
    key: "teams",
    icon: <Icon fontSize="small">groups</Icon>,
    route: "/teams",
    component: <ManageTeams />,
  },
  {
    type: "collapse",
    name: "Chatbots",
    key: "manage-bots",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/manage-bots",
    component: <ManageBots />,
  },
  {
    name: "Chatbots",
    key: "manage-bots",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/manage-bots/:activeTabParam",
    component: <ManageBots />,
  },
  {
    type: "collapse",
    name: "LLMs",
    key: "manage-llms",
    icon: <Icon fontSize="small">settings_suggest_outlined</Icon>,
    route: "/manage-llms",
    component: <ManageLLMs />,
  },
  {
    name: "Preview Document",
    key: "preview-doc",
    route: "/preview-document/kb/:kbId/ds/:dsId",
    component: <DocPreview />,
  },
  {
    name: "View Knowledge Base",
    key: "view-edit-kb",
    route: "/knowledge-base/:knowledgeBaseId",
    component: <ViewKnowledgeBase />,
  },
];

export default routes;
