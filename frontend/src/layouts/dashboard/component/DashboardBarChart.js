import Grid from "@mui/material/Grid";
import MDBox from "components/style-components/MDBox";
import HorizontalBarChart from "components/Charts/BarCharts/HorizontalBarChart";
import { useEffect, useState } from "react";
import { getRequest } from "utils/apiClient";
const DashboardBarChart = ({}) => {
  const [chartData, setChartData] = useState([]);
  const [botsWithoutLLM, setBotsWithoutLLM] = useState(0);
  const fetchBarChartData = async () => {
    try {
      const response = await getRequest("/dashboard/llm_distribution");

      setChartData({
        labels: response.labels,
        datasets: [response.datasets],
      });
      setBotsWithoutLLM(response.bots_without_llm);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };
  useEffect(() => {
    fetchBarChartData();
  }, []);
  return (
    <Grid item xs={12} md={6} lg={6}>
      <MDBox mb={3}>
        <HorizontalBarChart
          title="Bot Distribution accross LLM providers"
          badge={`Bots without LLM: ${botsWithoutLLM}`}
          chart={chartData}
        />
      </MDBox>
    </Grid>
  );
};
export default DashboardBarChart;
