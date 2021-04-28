import React from "react";

import AuthenticationRequiredPage from "@reearth/components/pages/Common/AuthenticationRequiredPage";
import Workspace from "@reearth/components/organisms/Settings/Workspace";

export type Props = {
  path?: string;
  teamId?: string;
};

const WorkspacePage: React.FC<Props> = ({ teamId = "" }) => (
  <AuthenticationRequiredPage>
    <Workspace teamId={teamId} />
  </AuthenticationRequiredPage>
);

export default WorkspacePage;
