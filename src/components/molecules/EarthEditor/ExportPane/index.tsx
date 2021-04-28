import React, { useState, useCallback } from "react";
import { useIntl } from "react-intl";
import { styled } from "@reearth/theme";
// TODO: 後で汎用化して PropertyPane をやめる
import Wrapper from "@reearth/components/atoms/PropertyPane";
import Button from "@reearth/components/atoms/Button";
import SelectBox, { Props as SelectBoxProps } from "@reearth/components/atoms/SelectBox";
import Text from "@reearth/components/atoms/Text";

export type Format = "kml" | "czml" | "geojson" | "shape";

const defaultFormat: Format = "kml";

type Props = {
  className?: string;
  show?: boolean;
  onExport: (format: Format) => void;
};

const ExportPane: React.FC<Props> = ({ className, show = true, onExport }) => {
  const intl = useIntl();
  const [format, setFormat] = useState<Format>(defaultFormat);

  const handleExport = useCallback(() => onExport(format), [format, onExport]);

  return show ? (
    <Wrapper className={className}>
      <SelectWrapper>
        <Label size="s">{intl.formatMessage({ defaultMessage: "Export type" })}</Label>
        <StyledSelectField
          selected={format}
          items={[
            { key: "kml", label: "KML" },
            { key: "czml", label: "CZML" },
            { key: "geojson", label: "GeoJSON" },
            { key: "shape", label: "Shapefile" },
          ]}
          onChange={f => setFormat(f ?? defaultFormat)}
        />
      </SelectWrapper>
      <StyledButton
        buttonType="primary"
        text={intl.formatMessage({ defaultMessage: "Export" })}
        onClick={handleExport}
      />
    </Wrapper>
  ) : null;
};

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 10px auto;
`;

const StyledSelectField = styled((props: SelectBoxProps<Format>) => (
  <SelectBox<Format> {...props} />
))`
  max-width: 190px;
  margin: 5px 10px;
  flex: 1;
`;

const StyledButton = styled(Button)`
  float: right;
`;

const Label = styled(Text)`
  margin-left: 10px;
`;

export default ExportPane;
