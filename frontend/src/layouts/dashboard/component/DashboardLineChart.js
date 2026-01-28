import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/style-components/MDBox";
import ReportsLineChart from "components/Charts/LineCharts/ReportsLineChart";

import { getRequest } from "utils/apiClient";
const DashboardLineChart = ({}) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const fetchLineChartData = async () => {
    try {
      const response = await getRequest("/dashboard/token_usage");

      setChartData({
        labels: response.labels,
        datasets: response.datasets,
      });
    } catch (error) {
      console.error("Error fetching Line Charts data", error);
    }
  };

  useEffect(() => {
    fetchLineChartData();
  }, []);

  const LineChartData = [
    {
      id: 1,
      color: "success",
      title: "Token Usage by Providers",
    },
  ];

  return (
    <>
      {LineChartData.map((m, idx) => (
        <Grid item xs={12} md={6} lg={6} key={m.id ?? idx}>
          <MDBox mb={2}>
            <ReportsLineChart title={m.title} chart={chartData} />
          </MDBox>
        </Grid>
      ))}
    </>
  );
};

export default DashboardLineChart;
