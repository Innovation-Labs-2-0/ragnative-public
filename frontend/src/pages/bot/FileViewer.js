import React from "react";
import DynamicFileViewer from "../../components/FileViewers/DynamicFileViewer";
import DashboardLayout from "../../components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../components/Navbars/DashboardNavbar";
import MDBox from "components/style-components/MDBox";
import { useParams, useSearchParams } from "react-router-dom";

const DocPreview = () => {
  const { kbId, dsId } = useParams();
  const [searchParams] = useSearchParams();
  const file = searchParams.get("file");
  const page = parseInt(searchParams.get("page")) || 1;
  const fileUrl = `/static/${kbId}/${dsId}/${file}`;

  return (
    <DashboardLayout>
      <DashboardNavbar routes={["preview-document", file]} />
      <MDBox mt={3}>
        <DynamicFileViewer fileUrl={fileUrl} initialPage={page} filename={file} />
      </MDBox>
    </DashboardLayout>
  );
};

export default DocPreview;
