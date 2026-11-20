"use client";

import { useEffect, useRef, useState } from "react";
import { loadCesium } from "@/lib/cesium/load-cesium";
import { getCesiumIonToken } from "@/lib/cesium/env";
import { pinDataUrl } from "@/components/globe/pin-canvas";
import type { GlobePlace } from "@/components/globe/types";
import { cn } from "@/lib/utils";
import "cesium/Build/Cesium/Widgets/widgets.css";

export type CesiumGlobePublicProps = {
  mode: "public";
  places: GlobePlace[];
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  className?: string;
  onReady?: () => void;
  onError?: (message: string) => void;
};

export type CesiumGlobePickerProps = {
  mode: "picker";
  draftPosition: { latitude: number; longitude: number } | null;
  onPick: (latitude: number, longitude: number) => void;
  flyTarget?: { latitude: number; longitude: number } | null;
  className?: string;
  onReady?: () => void;
  onError?: (message: string) => void;
};

type Props = CesiumGlobePublicProps | CesiumGlobePickerProps;

export function CesiumGlobeCore(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<import("cesium").Viewer | null>(null);
  const entityMapRef = useRef<Map<string, import("cesium").Entity>>(new Map());
  const draftEntityRef = useRef<import("cesium").Entity | null>(null);
  const CesiumRef = useRef<typeof import("cesium") | null>(null);
  const [booting, setBooting] = useState(true);
  const onHoverRef = useRef(props.mode === "public" ? props.onHover : null);
  const onSelectRef = useRef(props.mode === "public" ? props.onSelect : null);
  const onPickRef = useRef(props.mode === "picker" ? props.onPick : null);

  if (props.mode === "public") {
    onHoverRef.current = props.onHover;
    onSelectRef.current = props.onSelect;
  } else {
    onPickRef.current = props.onPick;
  }

  useEffect(() => {
    let destroyed = false;
    let handler: import("cesium").ScreenSpaceEventHandler | null = null;

    (async () => {
      if (!containerRef.current) return;
      try {
        const Cesium = await loadCesium();
        if (destroyed || !containerRef.current) return;
        CesiumRef.current = Cesium;

        const token = getCesiumIonToken();
        const baseLayer = await (async () => {
          if (token) {
            try {
              return await Cesium.ImageryLayer.fromProviderAsync(
                Cesium.createWorldImageryAsync({
                  style: Cesium.IonWorldImageryStyle.AERIAL,
                }),
              );
            } catch {
              /* fall through */
            }
          }
          return await Cesium.ImageryLayer.fromProviderAsync(
            Promise.resolve(
              new Cesium.UrlTemplateImageryProvider({
                url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                credit: "© CARTO",
              }),
            ),
          );
        })();

        let terrainProvider: import("cesium").TerrainProvider = new Cesium.EllipsoidTerrainProvider();
        if (token) {
          try {
            terrainProvider = await Cesium.createWorldTerrainAsync();
          } catch {
            /* ellipsoid */
          }
        }

        const viewer = new Cesium.Viewer(containerRef.current, {
          animation: false,
          timeline: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          vrButton: false,
          infoBox: false,
          selectionIndicator: false,
          baseLayer,
          terrainProvider,
          requestRenderMode: true,
          maximumRenderTimeChange: Infinity,
        });

        viewerRef.current = viewer;
        const scene = viewer.scene;
        scene.backgroundColor = Cesium.Color.fromCssColorString("#101114");
        scene.globe.enableLighting = true;
        scene.fog.enabled = true;
        scene.fog.density = 2.5e-4;
        if (scene.skyAtmosphere) {
          scene.skyAtmosphere.hueShift = -0.12;
          scene.skyAtmosphere.saturationShift = -0.2;
          scene.skyAtmosphere.brightnessShift = -0.25;
        }
        if (scene.sun) scene.sun.show = false;
        if (scene.moon) scene.moon.show = true;

        const credit = viewer.cesiumWidget.creditContainer as HTMLElement;
        credit.style.fontSize = "10px";
        credit.style.opacity = "0.6";

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(20, 25, 18_000_000),
        });

        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        if (props.mode === "picker") {
          handler.setInputAction((click: { position: import("cesium").Cartesian2 }) => {
            const cartesian =
              scene.pickPosition(click.position) ??
              viewer.camera.pickEllipsoid(click.position, scene.globe.ellipsoid);
            if (!cartesian) return;
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            onPickRef.current?.(latitude, longitude);
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        } else {
          handler.setInputAction((move: { endPosition: import("cesium").Cartesian2 }) => {
            const picked = scene.pick(move.endPosition);
            if (picked?.id?.id && typeof picked.id.id === "string") {
              onHoverRef.current?.(picked.id.id);
            } else {
              onHoverRef.current?.(null);
            }
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

          handler.setInputAction((click: { position: import("cesium").Cartesian2 }) => {
            const picked = scene.pick(click.position);
            if (picked?.id?.id && typeof picked.id.id === "string") {
              onSelectRef.current?.(picked.id.id);
            }
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }

        props.onReady?.();
        setBooting(false);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Could not start the globe";
        props.onError?.(msg);
        setBooting(false);
      }
    })();

    return () => {
      destroyed = true;
      handler?.destroy();
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
      viewerRef.current = null;
      entityMapRef.current.clear();
      draftEntityRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, [props.mode]);

  const publicPlaces = props.mode === "public" ? props.places : [];
  const publicSelectedId = props.mode === "public" ? props.selectedId : null;
  const publicHoveredId = props.mode === "public" ? props.hoveredId : null;

  useEffect(() => {
    if (props.mode !== "public") return;
    const viewer = viewerRef.current;
    const Cesium = CesiumRef.current;
    if (!viewer || !Cesium) return;

    const map = entityMapRef.current;
    const nextIds = new Set(publicPlaces.map((p) => p.id));

    for (const [id, entity] of map) {
      if (!nextIds.has(id)) {
        viewer.entities.remove(entity);
        map.delete(id);
      }
    }

    for (const place of publicPlaces) {
      const visited = place.category === "visited";
      const selected = place.id === publicSelectedId;
      const showLabel = place.id === publicHoveredId || selected;
      const image = pinDataUrl(visited, selected);
      const position = Cesium.Cartesian3.fromDegrees(place.longitude, place.latitude, 0);

      let entity = map.get(place.id);
      if (!entity) {
        entity = viewer.entities.add({
          id: place.id,
          position,
          billboard: {
            image,
            scale: selected ? 0.55 : 0.45,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: place.name,
            font: "600 13px system-ui, sans-serif",
            fillColor: Cesium.Color.fromCssColorString("#f4f4f5"),
            outlineColor: Cesium.Color.fromCssColorString("#101114"),
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -22),
            show: showLabel,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString("rgba(24,26,31,0.82)"),
            backgroundPadding: new Cesium.Cartesian2(10, 6),
          },
        });
        map.set(place.id, entity);
      } else {
        entity.position = new Cesium.ConstantPositionProperty(position);
        if (entity.billboard) {
          entity.billboard.image = new Cesium.ConstantProperty(image);
          entity.billboard.scale = new Cesium.ConstantProperty(selected ? 0.55 : 0.45);
        }
        if (entity.label) entity.label.show = new Cesium.ConstantProperty(showLabel);
      }
    }

    viewer.scene.requestRender();
  }, [props.mode, publicPlaces, publicSelectedId, publicHoveredId]);

  const prevSelected = useRef<string | null>(null);
  useEffect(() => {
    if (props.mode !== "public" || !publicSelectedId) return;
    if (prevSelected.current === publicSelectedId) return;
    prevSelected.current = publicSelectedId;

    const viewer = viewerRef.current;
    const Cesium = CesiumRef.current;
    if (!viewer || !Cesium) return;

    const place = publicPlaces.find((p) => p.id === publicSelectedId);
    if (!place) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        place.longitude,
        place.latitude,
        place.category === "visited" ? 1_200_000 : 2_400_000,
      ),
      duration: 1.8,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });
  }, [props.mode, publicSelectedId, publicPlaces]);

  const pickerDraft = props.mode === "picker" ? props.draftPosition : null;
  useEffect(() => {
    if (props.mode !== "picker") return;
    const viewer = viewerRef.current;
    const Cesium = CesiumRef.current;
    if (!viewer || !Cesium) return;

    const pos = pickerDraft;
    if (!pos) {
      if (draftEntityRef.current) {
        viewer.entities.remove(draftEntityRef.current);
        draftEntityRef.current = null;
      }
      viewer.scene.requestRender();
      return;
    }

    const position = Cesium.Cartesian3.fromDegrees(pos.longitude, pos.latitude, 0);
    if (!draftEntityRef.current) {
      draftEntityRef.current = viewer.entities.add({
        position,
        billboard: {
          image: pinDataUrl(true, true),
          scale: 0.5,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    } else {
      draftEntityRef.current.position = new Cesium.ConstantPositionProperty(position);
    }

    viewer.scene.requestRender();
  }, [props.mode, pickerDraft]);

  const flyTarget = props.mode === "picker" ? props.flyTarget : null;
  useEffect(() => {
    if (props.mode !== "picker" || !flyTarget) return;
    const viewer = viewerRef.current;
    const Cesium = CesiumRef.current;
    if (!viewer || !Cesium) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        flyTarget.longitude,
        flyTarget.latitude,
        1_800_000,
      ),
      duration: 1.6,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });
  }, [props.mode, flyTarget?.latitude, flyTarget?.longitude]);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", props.className)}>
      <div
        ref={containerRef}
        className="h-full min-h-[inherit] w-full [&_.cesium-viewer]:!rounded-2xl [&_.cesium-viewer-bottom]:!hidden"
        aria-label="Interactive 3D Earth globe"
      />
      {booting ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--bg-elevated)]/80 backdrop-blur-sm">
          <div className="text-center text-sm text-[var(--text-muted)]">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent-violet)]" />
            Warming up the globe…
          </div>
        </div>
      ) : null}
    </div>
  );
}