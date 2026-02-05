import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import DashboardPanel from "./DashboardPanels";
import { getRequest } from "utils/apiClient";
import { humanizeTime } from "utils/timeUtil";

import { DashboardIcons } from "utils/constants";
function DashboardLayer() {
  const [panels, setPanels] = useState([]);

  const fetchPanels = async () => {
    try {
      const response = await getRequest("/dashboard/get_update_statuses");

      const colors = ["primary", "secondary", "info", "success", "warning", "error"];
      const formattedPanels = [
        {
          title: "Recent Deployments",
          viewText: "View all",
          viewPath: "/manage-bots/2",
          items: response.deployments.map((item) => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return {
              avatar: item.avatar,
              title: `${item.name}`,
              description: `${item.status} - ${humanizeTime(item.updated_at)}`,
              color: randomColor,
            };
          }),
        },
        {
          title: "Knowledge Bases",
          viewText: "View all",
          viewPath: "/knowledge-bases",
          items: response.knowledge_bases?.map((kb) => {
            const RandomIcon = DashboardIcons[Math.floor(Math.random() * DashboardIcons.length)];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            return {
              icon: <RandomIcon size={20} />,
              title: kb.name,
              description: kb.user
                ? `by ${kb.user} - ${humanizeTime(kb.created_at)}`
                : humanizeTime(kb.created_at),
              color: randomColor,
            };
          }),
        },
        {
          title: "Recent Activity",
          items: response.activities?.map((item) => {
            const RandomIcon = DashboardIcons[Math.floor(Math.random() * DashboardIcons.length)];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            return {
              icon: <RandomIcon size={20} />,
              title: item.title,
              description: item.user
                ? `by ${item.user} - ${humanizeTime(item.created_at)}`
                : humanizeTime(item.created_at),
              color: randomColor,
            };
          }),
        },
      ];

      setPanels(formattedPanels);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchPanels();
  }, []);

  return (
    <Grid container spacing={3}>
      {panels.map((panel, i) => (
        <Grid item xs={12} md={4} key={i}>
          <DashboardPanel {...panel} />
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardLayer;
