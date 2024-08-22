import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

import { MapRef } from "@reearth/beta/features/Visualizer/Crust/types";
import { SketchFeature, SketchType, Geometry } from "@reearth/core";
import { useFeatureCollectionFetcher } from "@reearth/services/api";
import { NLSLayer } from "@reearth/services/api/layersApi/utils";

import { Tab } from "../../Navbar";

type Props = {
  tab: Tab;
  nlsLayers: NLSLayer[];
  selectedLayer: NLSLayer | undefined;
  visualizerRef: MutableRefObject<MapRef | null>;
  ignoreCoreLayerUnselect: MutableRefObject<boolean>;
};

export type FeatureProps = {
  layerId: string;
  type: string;
  geometry?: Geometry;
  properties?: any;
};

export type GeoJsonFeatureUpdateProps = {
  featureId: string;
  geometry: Geometry | undefined;
  layerId: string;
  properties?: any;
};

export type GeoJsonFeatureDeleteProps = {
  layerId: string;
  featureId: string;
};

export default ({
  tab,
  nlsLayers,
  selectedLayer,
  visualizerRef,
  ignoreCoreLayerUnselect,
}: Props) => {
  const [sketchType, setSketchType] = useState<SketchType | undefined>(undefined);

  const pendingSketchSelectionRef = useRef<{ layerId: string; featureId: string } | undefined>(
    undefined,
  );

  const handleSketchTypeChange = useCallback(
    (type: SketchType | undefined, from: "editor" | "plugin" = "editor") => {
      setSketchType(type);
      if (from === "editor") visualizerRef.current?.sketch?.setType?.(type);
      visualizerRef.current?.sketch?.overrideOptions?.({
        autoResetInteractionMode: false,
      });
    },
    [visualizerRef],
  );

  const { useAddGeoJsonFeature, useUpdateGeoJSONFeature, useDeleteGeoJSONFeature } =
    useFeatureCollectionFetcher();

  const handleSketchLayerAdd = useCallback(
    async (inp: FeatureProps) => {
      if (!selectedLayer?.id) return;
      await useAddGeoJsonFeature({
        layerId: inp.layerId,
        geometry: inp.geometry,
        type: inp.type,
        properties: inp.properties,
      });
    },
    [selectedLayer, useAddGeoJsonFeature],
  );

  const handleSketchFeatureCreate = useCallback(
    async (feature: SketchFeature | null) => {
      // TODO: create a new layer if there is no selected sketch layer
      if (!feature || !selectedLayer?.id || !selectedLayer.isSketch) return;

      await handleSketchLayerAdd({
        type: feature.type,
        layerId: selectedLayer?.id,
        properties: { ...feature.properties },
        geometry: feature.geometry,
      });

      pendingSketchSelectionRef.current = {
        layerId: selectedLayer.id,
        featureId: feature.properties.id,
      };

      ignoreCoreLayerUnselect.current = true;
    },
    [selectedLayer?.id, selectedLayer?.isSketch, ignoreCoreLayerUnselect, handleSketchLayerAdd],
  );

  useEffect(() => {
    // Workaround: we can't get an notice from core after nlsLayers got updated.
    // Therefore we need to get and select the latest sketch feature manually delayed.
    setTimeout(() => {
      if (pendingSketchSelectionRef.current) {
        const { layerId, featureId } = pendingSketchSelectionRef.current;
        const layer = visualizerRef?.current?.layers
          ?.layers?.()
          ?.find(l => l.id === layerId)?.computed;
        const feature = layer?.features?.find(f => f.properties?.id === featureId);
        if (feature) {
          visualizerRef?.current?.layers.selectFeature(layerId, feature?.id);
        }
        pendingSketchSelectionRef.current = undefined;
        ignoreCoreLayerUnselect.current = false;
      }
    }, 100);
  }, [nlsLayers, pendingSketchSelectionRef, visualizerRef, ignoreCoreLayerUnselect]);

  useEffect(() => {
    handleSketchTypeChange(undefined);
  }, [tab, handleSketchTypeChange]);

  useEffect(() => {
    if (!selectedLayer?.isSketch) {
      handleSketchTypeChange(undefined);
    }
  }, [selectedLayer, handleSketchTypeChange]);

  const handleGeoJsonFeatureUpdate = useCallback(
    async (inp: GeoJsonFeatureUpdateProps) => {
      await useUpdateGeoJSONFeature({
        layerId: inp.layerId,
        featureId: inp.featureId,
        geometry: inp.geometry,
        properties: inp.properties,
      });

      pendingSketchSelectionRef.current = {
        layerId: inp.layerId,
        featureId: inp.properties?.id,
      };
    },
    [useUpdateGeoJSONFeature],
  );

  const handleGeoJsonFeatureDelete = useCallback(
    async (inp: GeoJsonFeatureDeleteProps) => {
      await useDeleteGeoJSONFeature({
        layerId: inp.layerId,
        featureId: inp.featureId,
      });
    },
    [useDeleteGeoJSONFeature],
  );

  return {
    sketchType,
    handleSketchTypeChange,
    handleSketchFeatureCreate,
    handleGeoJsonFeatureUpdate,
    handleGeoJsonFeatureDelete,
  };
};
