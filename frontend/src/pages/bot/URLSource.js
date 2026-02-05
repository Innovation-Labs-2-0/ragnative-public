import React, { useState } from "react";
import {
  Grid,
  TextField,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Icon,
} from "@mui/material";
import MDButton from "components/style-components/MDButton";
import DiscoverLinks from "./DiscoverLinks";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { postRequest, patchRequest } from "utils/apiClient";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SecureButton from "components/SecureButton";
import { useKnowledgeBaseContext } from "context/KnowledgeBaseContext";
import MDTypography from "components/style-components/MDTypography";

function URLSourceForm({
  onUploadComplete,
  isEditing = false,
  dataSourceType,
  name: existingName = "",
  urls: existingURLs = [],
  matchPattern: existingMatchPattern = "",
  recursionLimit: existingRecursionLimit = "5",
  dataSourceId: existingDataSourceId = "",
  chunkSize: existingChunkSize = "2000",
  overlapSize: existingOverlapSize = "200",
  chunkingStrategy: existingChunkingStrategy = "delimiter",
  manualURLs: existingManualURLs = [],
  uploadedURL: existingUploadedURL = "",
  mode: existingMode = "dynamic",
}) {
  const [matchPattern, setMatchPattern] = useState(existingMatchPattern || "");
  const [recursionLimit, setRecursionLimit] = useState(existingRecursionLimit || "5");
  const [selectedURLs, setSelectedURLs] = useState([]);
  const [url, setUrl] = useState(existingMode === "dynamic" ? existingUploadedURL : "");
  const [discoveredLinks, setDiscoveredLinks] = useState(
    existingMode === "dynamic" ? existingURLs || [] : []
  );
  const [discoverLinksVisible, setDiscoverLinksVisible] = useState((existingURLs || []).length > 0);

  const [URLConfigVisible, setURLConfigVisible] = useState(
    existingMode === "dynamic" ? (existingURLs || []).length === 0 : false
  );

  const [dataSourceName, setDataSourceName] = useState(existingName || "");
  const [chunkingStrategy, setChunkingStrategy] = useState(existingChunkingStrategy || "delimiter");
  const [chunkSize, setChunkSize] = useState(existingChunkSize || "2000");
  const [overlapSize, setOverlapSize] = useState(existingOverlapSize || "200");
  const [manualMode, setManualMode] = useState(existingMode === "manual" ? true : false || false);
  const [manualURLs, setManualURLs] = useState(
    existingMode === "manual"
      ? existingURLs?.join("\n")
      : "" || "https://example.com\nhttps://example.com/page"
  );
  const [dataSourceId, setDataSourceId] = useState(existingDataSourceId || "");
  const [isDiscoveringLinks, setIsDiscoveringLinks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const chunkingStrategyOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "semantic", label: "Semantic" },
    { value: "delimiter", label: "Delimiter" },
  ];

  const { kbId: knowledgeBaseId } = useKnowledgeBaseContext();

  const onClickDiscoverLinks = async () => {
    setIsDiscoveringLinks(true);
    try {
      const payload = {
        name: dataSourceName,
        uploaded_url: url,
        crawling_config: { regex: matchPattern, recursion_limit: recursionLimit },
        knowledge_base: knowledgeBaseId,
        chunk_config: { chunk_size: chunkSize, chunk_overlap: overlapSize },
        chunk_strategy: chunkingStrategy,
        source_type: dataSourceType,
      };

      const response = await postRequest("/datasource/url/discover_links", payload);
      setDataSourceId(response._id);
      setDiscoveredLinks(response.extracted_links);
      setSelectedURLs(response.extracted_links);
      setURLConfigVisible(false);
      setDiscoverLinksVisible(true);
    } catch (error) {
      console.log("Error while discovering links", error);
    } finally {
      setIsDiscoveringLinks(false);
    }
  };

  const handleDeleteLink = (linkToRemove) => {
    setDiscoveredLinks((prevLinks) => prevLinks.filter((link) => link !== linkToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (manualMode) {
        await saveManualURLDataSource();
      } else {
        await saveDiscoverableURLDataSource();
      }
    } catch (error) {
      console.log("Error while Saving URL Data Source", error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveManualURLDataSource = async () => {
    const isUpdate = isEditing && dataSourceId;

    const addedManualUrls = manualURLs
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const payload = {
      name: dataSourceName,
      knowledge_base: knowledgeBaseId,
      chunk_config: { chunk_size: chunkSize, chunk_overlap: overlapSize },
      chunk_strategy: chunkingStrategy,
      urls: addedManualUrls,
      source_type: dataSourceType,
    };
    let response;
    try {
      if (isUpdate) {
        response = await patchRequest(`/datasource/update/manual_urls/${dataSourceId}`, payload);
        console.log("Response of manual entry:", response);
      } else {
        response = await postRequest("/datasource/manual_urls", payload);
        console.log("Response of manual entry:", response);
      }

      onUploadComplete({
        id: response._id,
        name: payload.name,
        links: payload.urls,
        mode: "manual",
      });
    } catch (error) {
      console.error("Manual data source save failed:", error);
    }
  };

  const saveDiscoverableURLDataSource = async () => {
    const finalUrls = discoveredLinks.length > 0 ? discoveredLinks : [url];
    const payload = {
      urls: finalUrls,
      chunk_strategy: chunkingStrategy,
      chunk_config: { chunk_size: chunkSize, chunk_overlap: overlapSize },
      url_config: { crawling_config: { regex: matchPattern, recursion_limit: recursionLimit } },
    };

    const response = await patchRequest(`/datasource/url/${dataSourceId}`, payload);
    onUploadComplete({
      id: response._id,
      name: dataSourceName,
      links: finalUrls,
      mode: "dynamic",
    });
  };

  return (
    <>
      <Grid item xs={12} display="flex" justifyContent="flex-end" mt={0}>
        <Tooltip title="Toggle between discovering links dynamically or entering URLs manually">
          <FormControlLabel
            control={
              <Switch
                checked={manualMode}
                onChange={(e) => {
                  setManualMode(e.target.checked);
                  setDiscoverLinksVisible(false);
                  setURLConfigVisible(!e.target.checked);
                }}
                color="primary"
                disabled={isEditing}
              />
            }
            label="Enter Links Manually"
            labelPlacement="start"
          />
        </Tooltip>
      </Grid>

      <Grid container spacing={2} mt={0.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={dataSourceName ? "Data Source Name" : ""}
            value={dataSourceName}
            onChange={(e) => setDataSourceName(e.target.value)}
            placeholder="Enter a name for your data source"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Chunking Strategy</InputLabel>
            <Select
              value={chunkingStrategy}
              label="Chunking Strategy"
              onChange={(e) => setChunkingStrategy(e.target.value)}
              sx={{ height: "44px" }}
              endAdornment={
                <Tooltip
                  title={
                    <>
                      Choose how your documents are split into chunks:-
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "1.2rem",
                          textAlign: "left",
                          listStylePosition: "outside",
                        }}
                      >
                        <li>Fixed: Splits text into chunks of a fixed character length.</li>
                        <li>
                          Semantic: Splits text based on meaning or sentence boundaries, aiming to
                          keep related content together.
                        </li>
                        <li>
                          Delimiter: Splits text using a custom delimiter (e.g., paragraphs,
                          headings, or specific characters) that you define.
                        </li>
                      </ul>
                    </>
                  }
                  placement="bottom"
                >
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="16px" />
                  </IconButton>
                </Tooltip>
              }
            >
              {chunkingStrategyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {chunkingStrategy === "semantic" && (
            <div style={{ color: "#fb8c00" }}>
              {`Note: The Semantic chunking strategy is experimental and may not always give stable
              results.`}
            </div>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Chunk Size"
            value={chunkSize}
            onChange={(e) => setChunkSize(e.target.value)}
            InputProps={{
              endAdornment: (
                <Tooltip title=" This defines the maximum number of characters in a single document chunk.">
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="16px" />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Overlap Size"
            value={overlapSize}
            onChange={(e) => setOverlapSize(e.target.value)}
            InputProps={{
              endAdornment: (
                <Tooltip
                  title={
                    <>
                      This is the number of characters to overlap between consecutive chunks.
                      <br /> Overlapping helps maintain context across chunks, ensuring that if a
                      key piece of information falls at a chunk boundary, it&apos;s still captured
                      in the adjacent chunk.
                    </>
                  }
                >
                  <IconButton size="small">
                    <HelpOutlineIcon fontSize="16px" />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
        </Grid>

        {!manualMode && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Match Pattern"
                value={matchPattern}
                onChange={(e) => setMatchPattern(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Recursion Limit"
                value={recursionLimit}
                onChange={(e) => setRecursionLimit(e.target.value)}
              />
            </Grid>
          </>
        )}

        {!manualMode && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Grid>
        )}

        {manualMode && (
          <Grid item xs={12}>
            <TextField
              label="Enter Links (one per line)"
              value={manualURLs}
              onChange={(e) => setManualURLs(e.target.value)}
              fullWidth
              multiline
              minRows={5}
            />
          </Grid>
        )}

        {URLConfigVisible && !manualMode && (
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <SecureButton
              buttonKey="/button/discover-links"
              variant="gradient"
              color="info"
              size="small"
              onClick={onClickDiscoverLinks}
              disabled={isDiscoveringLinks || isSaving}
              startIcon={isDiscoveringLinks ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {isDiscoveringLinks ? "Discovering..." : "Discover Links"}
            </SecureButton>
          </Grid>
        )}
      </Grid>

      {discoverLinksVisible && (
        <>
          {discoveredLinks.length > 0 ? (
            <DiscoverLinks links={discoveredLinks} onDelete={handleDeleteLink} />
          ) : (
            <Grid>
              <MDTypography mt={2} pl={0.5} variant="body2" component="p" color="info">
                <Icon size="small" sx={{ mt: "0.5rem" }}>
                  info
                </Icon>
                No Internal links found for the provided link.
              </MDTypography>
            </Grid>
          )}
        </>
      )}

      {(discoverLinksVisible || manualMode) && (
        <Grid item xs={12} mt={2} display="flex" justifyContent="flex-end">
          <SecureButton
            buttonKey="/button/add-document"
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSave}
            disabled={isDiscoveringLinks || isSaving}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isSaving ? "Saving..." : "Save"}
          </SecureButton>
        </Grid>
      )}
    </>
  );
}

URLSourceForm.propTypes = {
  onUploadComplete: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  dataSourceType: PropTypes.string,
  name: PropTypes.string,
  urls: PropTypes.string,
  matchPattern: PropTypes.string,
  recursionLimit: PropTypes.string,
  dataSourceId: PropTypes.string,
  chunkSize: PropTypes.string,
  overlapSize: PropTypes.string,
  chunkingStrategy: PropTypes.string,
  manualURLs: PropTypes.string,
  uploadedURL: PropTypes.string,
  mode: PropTypes.string,
};

export default URLSourceForm;
