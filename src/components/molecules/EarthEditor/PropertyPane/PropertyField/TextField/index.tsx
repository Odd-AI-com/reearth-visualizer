import React from "react";
import { styled } from "@reearth/theme";
import colors from "@reearth/theme/colors";

import Text from "@reearth/components/atoms/Text";
import TextBox from "@reearth/components/atoms/TextBox";
import { FieldProps } from "../types";

export type Props = FieldProps<string> & {
  className?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  multiline?: boolean;
  onClick?: () => void;
};

const TextField: React.FC<Props> = ({
  className,
  name,
  value,
  placeholder,
  prefix,
  suffix,
  multiline,
  linked,
  overridden,
  disabled,
  onChange,
  onClick,
}) => {
  const color = overridden
    ? colors.danger.main
    : linked
    ? colors.primary.main
    : disabled
    ? colors.outline.main
    : undefined;

  return (
    <Wrapper className={className} onClick={onClick}>
      <TextBox
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={linked || overridden || disabled}
        multiline={multiline}
        prefix={prefix}
        suffix={suffix}
        color={color}
      />
      {name && <Text size="xs">{name}</Text>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

export default TextField;
