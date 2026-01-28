// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/style-components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import DashboardLayer from "./component/DashboardLayer";
import Footer from "components/Footer";
import WidgetsGrid from "./component/DashboardWidgets";
import DashboardBarChart from "./component/DashboardBarChart";
import DashboardLineChart from "./component/DashboardLineChart";

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <WidgetsGrid />
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <DashboardBarChart />
            <DashboardLineChart />
          </Grid>
        </MDBox>
        <DashboardLayer />
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
