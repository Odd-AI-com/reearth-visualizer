import { styled } from "@reearth/theme";
import colors from "@reearth/theme/colors";
import fonts from "@reearth/theme/fonts";

type Props = {
  linked?: boolean;
  overridden?: boolean;
  inactive?: boolean;
  selected?: boolean;
};

const Check = styled.li<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  list-style: none;
  padding: 6px;
  margin-right: 2px;
  font-size: ${fonts.sizes.m}px;
  color: ${({ linked, overridden, selected, inactive, theme }) =>
    selected && linked
      ? colors.primary.main
      : selected && overridden
      ? colors.danger.main
      : inactive
      ? colors.outline.main
      : theme.properties.contentsText};
  background: ${({ selected, theme }) => (selected ? theme.main.bg : "none")};
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 2px;
`;

export default Check;
