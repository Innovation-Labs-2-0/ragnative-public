import { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
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
import { useNavigate } from "react-router-dom";
import { DynamicCardContext } from "context/DynamicCardContext";

function KnowledgeBases() {
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleKbs, setVisibleKbs] = useState(6);
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [anchorEle, setAnchorEle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const expndedCardState = { activeCard, setActiveCard };
  const navigate = useNavigate();

  const fetchKnowledgeBases = async () => {
    try {
      setLoading(true);
      const response = await getRequest(`/knowledge_base/`, {
        search: searchQuery,
        sort_by: sortField,
        order: sortOrder,
      });
      setKnowledgeBases(response);
    } catch (err) {
      setError("Could not fetch knowledge bases. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeBases();
  }, [searchQuery, sortField, sortOrder]);

  const handleMore = () => setVisibleKbs(visibleKbs + 6);
  const handleMenuOpen = (event) => setAnchorEle(event.currentTarget);
  const handleMenuClose = () => setAnchorEle(null);

  const handleSortSelect = (field) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
    handleMenuClose();
  };

  const renderNoKBFound = () => {
    if (loading) {
      return (
        <MDBox display="flex" justifyContent="center" mt={5}>
          <CircularProgress color="info" />
        </MDBox>
      );
    }
    if (error) {
      return (
        <MDTypography color="error" ml={2}>
          {error}
        </MDTypography>
      );
    }
    if (knowledgeBases.length === 0 && !loading) {
      return (
        <MDBox display="flex" flexDirection="column" alignItems="center" mt={5}>
          <SearchIcon fontSize="large" color="disabled" />
          <MDTypography variant="body1" color="textSecondary" mt={1}>
            No Knowledge Bases found.
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
          px={2}
          flexShrink={0}
        >
          <MDTypography variant="h5" fontWeight="medium">
            Knowledge Bases
          </MDTypography>
          <MDBox display="flex" alignItems="center" gap={1} flexGrow={1} justifyContent="flex-end">
            {/* Search Field */}
            <MDBox sx={{ flexGrow: 1 }} maxWidth="450px">
              <TextField
                placeholder="Search Knowledge Base"
                variant="outlined"
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  backgroundColor: "secondary",
                  borderRadius: "17px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "17px",
                    "& fieldset": { borderWidth: 1 },
                  },
                }}
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
              <MenuItem onClick={() => handleSortSelect("name")}>
                <Box className="Knowledgebse-sort-menu-items">
                  Sort by Name
                  {sortField === "name" &&
                    (sortOrder === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 2 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 2 }} />
                    ))}
                </Box>
              </MenuItem>
              <MenuItem onClick={() => handleSortSelect("created_at")}>
                <Box className=" dynamic-card-created-at-box">
                  Sort by Date
                  {sortField === "created_at" &&
                    (sortOrder === "desc" ? (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 2 }} />
                    ) : (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 2 }} />
                    ))}
                </Box>
              </MenuItem>
            </Menu>
          </MDBox>
        </MDBox>
      </MDBox>
      {/* Card Grid Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {knowledgeBases.length > 0 ? (
          <Grid container spacing={3}>
            {knowledgeBases.slice(0, visibleKbs).map((kb) => (
              <Grid item xs={12} sm={6} md={4} key={kb.id}>
                <DynamicCardContext.Provider value={expndedCardState}>
                  <DynamicCard
                    id={kb.id}
                    title={kb.name}
                    headerIcon={false}
                    mainFields={{
                      layout: "grid",
                      fields: [{ label: "Bot Assigned", value: kb.bot_name || "None" }],
                    }}
                    createdAt={{
                      enabled: true,
                      date: new Date(kb.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                    }}
                    expandableConfig={{
                      enabled: true,
                      layout: "stacked",
                      fields: [
                        {
                          label: "Description:",
                          value: kb.description || "No description provided",
                        },
                      ],
                    }}
                    defaultActions={{
                      edit: {
                        enabled: true,
                        onClick: () => navigate(`/knowledge-base/${kb.id}`),
                      },
                    }}
                  />
                </DynamicCardContext.Provider>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            {renderNoKBFound()}
          </Grid>
        )}
      </Grid>

      {/* Show More Button */}
      {knowledgeBases.length > visibleKbs && (
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
    </DashboardLayout>
  );
}

export default KnowledgeBases;
