import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/style-components/MDBox";
import ComplexStatisticsCard from "components/Cards/StatisticsCards/ComplexStatisticsCard";
import { Bot, CheckCircle, XCircle, Clock } from "lucide-react";
import { getRequest } from "utils/apiClient";
const WidgetsGrid = () => {
  const [values, setValues] = useState([]);

  const fetchCount = async () => {
    try {
      const response = await getRequest("/dashboard/widget_stats");
      setValues(response);
    } catch (error) {
      console.error("Error fetching Count for widgets", error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);
  const widgetMetaData = [
    { id: 1, title: "TOTAL BOTS", color: "info", icon: <Bot size={30} />, key: "total_bots" },
    {
      id: 2,
      title: "ACTIVE BOTS",
      color: "success",
      icon: <CheckCircle size={30} />,
      key: "active_bots",
    },
    {
      id: 3,
      title: "INACTIVE BOTS",
      color: "error",
      icon: <XCircle size={30} />,
      key: "inactive_bots",
    },
    {
      id: 4,
      title: "IN PROGRESS",
      color: "warning",
      icon: <Clock size={30} />,
      key: "inprogress_bots",
    },
  ];
  return (
    <Grid container spacing={3}>
      {widgetMetaData.map((m) => (
        <Grid item xs={12} md={6} lg={3} key={m.id}>
          <MDBox>
            <div>
              <ComplexStatisticsCard
                color={m.color}
                icon={m.icon}
                title={m.title}
                count={values?.[m.key] ?? "-"}
              />
            </div>
          </MDBox>
        </Grid>
      ))}
    </Grid>
  );
};

export default WidgetsGrid;
