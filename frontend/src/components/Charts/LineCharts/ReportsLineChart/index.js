// /**
// =========================================================
// * Material Dashboard 2  React - v2.2.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/material-dashboard-react
// * Copyright 2023 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */no

import { useMemo } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import Card from "@mui/material/Card";

import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import { DashboardColors } from "utils/constants";

// ReportsLineChart configurations
import configs from "components/Charts/LineCharts/ReportsLineChart/configs";
import { getLLMColor } from "utils/constants";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ReportsLineChart({ title, description, height, date, chart }) {
  const chartDatasets = (chart.datasets || []).map((dataset) => {
    const color = dataset.label ? getLLMColor(dataset.label) : DashboardColors;
    return {
      ...dataset,
      tension: 0.4,
      borderColor: color,
      backgroundColor: color,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      fill: false,
      cubicInterpolationMode: "monotone",
    };
  });

  const { data, options } = configs(chart.labels || [], chartDatasets || []);

  const renderChart = (
    <MDBox padding="1rem">
      <MDBox pb={2} px={1}>
        {title && (
          <MDTypography variant="subtitle" sx={{ fontWeight: 600 }}>
            {title}
          </MDTypography>
        )}
        {description && (
          <MDTypography component="div" variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        )}
        {date && (
          <MDBox display="flex" alignItems="center" mt={1}>
            <MDTypography variant="button" color="text" fontWeight="light">
              {date}
            </MDTypography>
          </MDBox>
        )}
      </MDBox>

      {useMemo(
        () => (
          <MDBox height={height}>
            <Line data={data} options={options} redraw />
          </MDBox>
        ),
        [chart.labels, chart.datasets, height]
      )}
    </MDBox>
  );

  return title || description ? <Card sx={{ height: "100%" }}>{renderChart}</Card> : renderChart;
}

ReportsLineChart.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.shape({
    labels: PropTypes.array,
    datasets: PropTypes.array,
  }).isRequired,
};

ReportsLineChart.defaultProps = {
  description: "",
  date: "",
  height: "20.58rem",
};

export default ReportsLineChart;
