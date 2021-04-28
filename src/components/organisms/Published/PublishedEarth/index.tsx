import React from "react";

import Earth from "@reearth/components/molecules/Published/Earth";
import InfoBox from "@reearth/components/molecules/EarthEditor/InfoBox/SimpleInfoBox";

import useHooks from "./hooks";

export interface Props {
  className?: string;
  alias?: string;
}

const Published: React.FC<Props> = ({ alias }) => {
  const {
    sceneProperty,
    selectedLayerId,
    selectLayer,
    layers,
    widgets,
    selectedLayer,
    infoBoxVisible,
    initialLoaded,
  } = useHooks(alias);

  return (
    <>
      <Earth
        sceneProperty={sceneProperty}
        layers={layers}
        widgets={widgets}
        onLayerSelect={selectLayer}
        selectedLayerId={selectedLayerId}
        initialLoaded={initialLoaded}
      />
      <InfoBox
        infoboxKey={selectedLayer?.id}
        visible={!!selectedLayer?.infobox && infoBoxVisible}
        name={selectedLayer?.title}
        property={selectedLayer?.infobox?.property}
        blocks={selectedLayer?.infobox?.blocks}
      />
    </>
  );
};

export default Published;
