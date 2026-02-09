import { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Card,
  Box,
} from "@mui/material";
import { getRequest } from "utils/apiClient";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import DynamicCard from "components/Cards/DynamicCard/DynamicCard";
import useDebounce from "hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import MDButton from "components/style-components/MDButton";
import { useParams } from "react-router-dom";
import { DynamicCardContext } from "context/DynamicCardContext";

function ManageBots() {
  const [chatBots, setChatBots] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleBots, setVisibleBots] = useState(6);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("-1");
  const [anchorEle, setAnchorEle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { activeTabParam } = useParams();
  const [activeTab, setActiveTab] = useState(activeTabParam ? Number.parseInt(activeTabParam) : 0);
  const navigate = useNavigate();
  const tabStatusMap = {
    0: "Draft",
    1: "Unpublished",
    2: "Published",
    3: "Past",
  };
  const [botStatus, setBotStatusFilter] = useState(tabStatusMap[activeTab]);
  const [activeCard, setActiveCard] = useState(null);
  const expandedCardState = { activeCard, setActiveCard };
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const handleTabChange = (_, newValue) => {
    if (newValue === activeTab) return;
    setBotStatusFilter(tabStatusMap[newValue]);
    setActiveTab(newValue);
    fetchChatBots(tabStatusMap[newValue]);
  };

  const fetchChatBots = async (status) => {
    try {
      setLoading(true);
      const statusValue = status ? status : botStatus;
      const bots = await getRequest("/bot/all_chatbots/", {
        search: searchQuery,
        sortBy: sortField,
        sortDirection: sortOrder,
        botStatus: statusValue,
      });
      setChatBots(bots);
    } catch (err) {
      setLoading(false);
      setChatBots([]);
      setError("Could not fetch bots. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatBots();
  }, [debouncedSearchQuery, sortField, sortOrder]);

  const handleMore = () => setVisibleBots(visibleBots + 6);
  const handleMenuOpen = (event) => setAnchorEle(event.currentTarget);
  const handleMenuClose = () => setAnchorEle(null);

  const handleSortSelect = (field) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "1" ? "-1" : "1"));
    } else {
      setSortField(field);
      setSortOrder(field === "name" ? "1" : "-1");
    }
    handleMenuClose();
  };

  const renderNoBotsFound = () => {
    if (loading) {
      return (
        <MDBox display="flex" justifyContent="center" mt={5}>
          <CircularProgress color="info" />
        </MDBox>
      );
    }
    if (error) {
      return (
        <MDBox display="flex" flexDirection="column" alignItems="center" mt={5}>
          <MDTypography color="error" ml={2}>
            {error}
          </MDTypography>
        </MDBox>
      );
    }
    if (chatBots.length === 0 && !loading) {
      return (
        <MDBox display="flex" flexDirection="column" alignItems="center" mt={5}>
          <SearchIcon fontSize="large" color="disabled" />
          <MDTypography variant="body1" color="textSecondary" mt={1}>
            No Bots found.
          </MDTypography>
        </MDBox>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={2} mb={2} display="flex" flexDirection="column">
        {/* Header Row */}
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexShrink={0}
        >
          <MDTypography variant="h5" fontWeight="medium">
            Chatbots
          </MDTypography>
          <MDBox display="flex" alignItems="center" gap={1} flexGrow={1} justifyContent="flex-end">
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDButton
                variant="contained"
                color="primary"
                onClick={() => navigate("/create-bot")}
                startIcon={<Add />}
              >
                Create bot
              </MDButton>
            </MDBox>
            {/* Search Field */}
            <MDBox sx={{ flexGrow: 1 }} maxWidth="300px">
              <TextField
                placeholder="Search Chatbots"
                variant="outlined"
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>

            {/* Sort Menu */}
            <IconButton color="info" onClick={handleMenuOpen}>
              <SortIcon />
            </IconButton>

            <Menu anchorEl={anchorEle} open={Boolean(anchorEle)} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleSortSelect("created_at")}>
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  Sort by Date
                  {sortField === "created_at" &&
                    (sortOrder === "1" ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 2 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 2 }} />
                    ))}
                </MDBox>
              </MenuItem>
              <MenuItem onClick={() => handleSortSelect("name")}>
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  Sort by Name
                  {sortField === "name" &&
                    (sortOrder === "1" ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 2 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 2 }} />
                    ))}
                </MDBox>
              </MenuItem>
            </Menu>
          </MDBox>
        </MDBox>

        {/* Card Grid Section */}
        <MDBox mt={1}>
          <Card className="manage-bots-card" sx={{ p: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              className="manage-bots-tab"
            >
              <Tab label="Drafts" />
              <Tab label="Not Published" />
              <Tab label="Published" />
              <Tab label="Past" />
            </Tabs>
            <Box>
              <MDBox py={2}>
                {chatBots.length > 0 ? (
                  <Grid container spacing={3} px={1}>
                    {chatBots.slice(0, visibleBots).map((bot) => (
                      <Grid item xs={12} sm={6} md={4} key={bot.id}>
                        <DynamicCardContext.Provider value={expandedCardState}>
                          <DynamicCard
                            id={bot._id}
                            title={bot.name}
                            headerIcon={false}
                            createdAt={{
                              enabled: true,
                              date: new Date(bot.created_at).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }),
                            }}
                            expandableConfig={{
                              enabled: true,
                              layout: "grid",
                              fields: [
                                {
                                  label: "Description",
                                  value: bot.description || "No description provided",
                                },
                                {
                                  label: "Knowledge Base",
                                  value:
                                    bot.knowledge_base_details?.name ||
                                    "Knowledge base does not exist",
                                },
                              ],
                            }}
                            defaultActions={{
                              edit: {
                                enabled:
                                  bot.knowledge_base_details?.ingestion_status == "in progress"
                                    ? false
                                    : true,
                                onClick: () => {
                                  const editURL = `/edit-bot/${bot._id}/version/${bot.version_details._id}`;
                                  navigate(editURL);
                                },
                              },
                            }}
                          />
                        </DynamicCardContext.Provider>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  renderNoBotsFound()
                )}
              </MDBox>
            </Box>
            {chatBots.length > visibleBots && (
              <MDBox display="flex" justifyContent="center" mt={2}>
                <MDTypography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer", fontWeight: "medium" }}
                  onClick={handleMore}
                >
                  Show More...
                </MDTypography>
              </MDBox>
            )}
          </Card>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default ManageBots;
