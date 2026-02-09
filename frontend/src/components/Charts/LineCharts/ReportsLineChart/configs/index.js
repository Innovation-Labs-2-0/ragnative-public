// /**
// =========================================================
// * Material Dashboard 2 React - v2.1.0
// =========================================================

// * Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard-pro
// * Copyright 2023 Creative Tim (https://www.creative-tim.com)

// Coded by www.creative-tim.com

//  =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// */

import typography from "assets/theme/base/typography";

function configs(labels = [], datasets = [], axisTitles = { x: "Date", y: "Token Usage" }) {
  return {
    data: {
      labels,
      datasets: [...datasets],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: false, // show circular markers in legend (Chart.js will use dataset colors)
            padding: 12,
            boxWidth: 15,
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          title: {
            display: true,
            text: axisTitles.y,
            color: "#b2b9bf",
            font: {
              size: 14,
              family: typography.fontFamily,
              style: "italic",
            },
            padding: { bottom: 10 },
          },
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: "#c1c4ce5c",
          },
          ticks: {
            display: true,
            color: "#b2b9bf",
            padding: 10,
            font: {
              size: 14,
              family: typography.fontFamily,
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          title: {
            display: true,
            text: axisTitles.x,
            color: "#b2b9bf",
            font: {
              size: 14,
              family: typography.fontFamily,
              style: "italic",
            },
            padding: { top: 10 },
          },
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#b2b9bf",
            padding: 10,
            font: {
              size: 14,
              family: typography.fontFamily,
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
      elements: {
        line: {
          tension: 0, // keep straight lines; change to 0.4 if you want smooth
        },
        point: {
          radius: 0, // hide points on the lines; set to 5 to show them
        },
      },
    },
  };
}

export default configs;
