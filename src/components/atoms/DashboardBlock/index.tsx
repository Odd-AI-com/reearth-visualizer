import React from "react";
import { styled } from "@reearth/theme";

export interface Props {
  className?: string;
  grow?: number;
}

const DashboardBlock: React.FC<Props> = ({ className, children, grow }) => {
  return (
    <StyledWrapper className={className} grow={grow}>
      <Block>{children}</Block>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ grow?: number }>`
  flex-grow: ${props => (props.grow ? props.grow : 1)};
`;

const Block = styled.div`
  border-radius: 12px;
  margin: 14px;
  background-color: ${props => props.theme.dashboard.itemBg};
`;

export default DashboardBlock;
