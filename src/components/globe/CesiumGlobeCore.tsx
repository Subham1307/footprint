"use client";

import { useEffect, useRef, useState } from "react";
import { loadCesium } from "@/lib/cesium/load-cesium";
import { attachViewerResize, waitForNonZeroSize } from "@/lib/cesium/wait-for-size";
import { getCesiumIonToken } from "@/lib/cesium/env";
import { haloDataUrl, pinDataUrl } from "@/components/globe/pin-canvas";
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
  resetSignal?: number;
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

type CesiumModule = typeof import("cesium");

const OVERVIEW_HEIGHT = 18_000_000;
const IDLE_BEFORE_SPIN_MS = 6_000;
/** Depth-test pins when far away so markers on the back of the Earth stay hidden. */
const DEPTH_TEST_OFF_WITHIN = 3_000_000;

const VIOLET = "#8b7cf8";
const BLUE = "#60a5fa";

function phaseFromId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(h) % 1000) / 1000;
}

function pulse(phase: number, periodMs: number) {
  const t = performance.now() / periodMs + phase;
  return (Math.sin(t * Math.PI * 2) + 1) / 2;
}

const HALO_SUFFIX = "::halo";

function pickedPlaceId(Cesium: CesiumModule, picked: unknown): string | null {
  const entity = (picked as { id?: unknown } | undefined)?.id;
  if (!(entity instanceof Cesium.Entity) || typeof entity.id !== "string") return null;
  return entity.id.endsWith(HALO_SUFFIX) ? entity.id.slice(0, -HALO_SUFFIX.length) : entity.id;
}

export function CesiumGlobeCore(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<import("cesium").Viewer | null>(null);
  const cesiumRef = useRef<CesiumModule | null>(null);
  const entityMapRef = useRef<Map<string, import("cesium").Entity>>(new Map());
  const lastInputRef = useRef(0);
  const selectedRef = useRef<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
    if (props.mode === "public") {
      selectedRef.current = props.selectedId;
      hoveredRef.current = props.hoveredId;
    }
  });

  const mode = props.mode;

  useEffect(() => {
    const entityMap = entityMapRef.current;
    const abort = new AbortController();
    let destroyed = false;
    let handler: import("cesium").ScreenSpaceEventHandler | null = null;
    let detachResize: (() => void) | null = null;
    let removeRenderError: (() => void) | null = null;
    let removePreRender: (() => void) | null = null;

    (async () => {
      const host = containerRef.current;
      if (!host) return;
      try {
        await waitForNonZeroSize(host, abort.signal);
        if (destroyed || !containerRef.current) return;

        const Cesium = await loadCesium();
        if (destroyed || !containerRef.current) return;
        cesiumRef.current = Cesium;

        const token = getCesiumIonToken();
        const baseLayer = await (async () => {
          if (token) {
            try {
              return await Cesium.ImageryLayer.fromProviderAsync(
                Cesium.createWorldImageryAsync({ style: Cesium.IonWorldImageryStyle.AERIAL }),
              );
            } catch {
              /* fall back to Carto */
            }
          }
          return await Cesium.ImageryLayer.fromProviderAsync(
            Promise.resolve(
              new Cesium.UrlTemplateImageryProvider({
                url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                credit: "© CARTO © OpenStreetMap contributors",
                maximumLevel: 18,
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
        if (destroyed || !containerRef.current) return;

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
          scene3DOnly: true,
          baseLayer,
          terrainProvider,
          useBrowserRecommendedResolution: false,
          showRenderLoopErrors: false,
          contextOptions: {
            webgl: { alpha: true, failIfMajorPerformanceCaveat: false },
          },
        });

        if (destroyed) {
          viewer.destroy();
          return;
        }

        viewerRef.current = viewer;
        const dpr = window.devicePixelRatio || 1;
        viewer.resolutionScale = Math.min(dpr, 2) / dpr;
        detachResize = attachViewerResize(viewer, containerRef.current);

        const scene = viewer.scene;
        scene.rethrowRenderErrors = false;
        removeRenderError = scene.renderError.addEventListener((_scene, err) => {
          const msg = err instanceof Error ? err.message : String(err);
          propsRef.current.onError?.(msg);
          setFailed(true);
          if (!viewer.isDestroyed()) viewer.useDefaultRenderLoop = false;
        });

        scene.backgroundColor = Cesium.Color.fromCssColorString("#07080b");
        scene.globe.baseColor = Cesium.Color.fromCssColorString("#0b0d12");
        scene.globe.enableLighting = false;
        scene.globe.showGroundAtmosphere = true;
        scene.fog.enabled = true;
        scene.fog.density = 2.0e-4;
        scene.highDynamicRange = false;
        if (scene.skyAtmosphere) {
          scene.skyAtmosphere.show = true;
          scene.skyAtmosphere.hueShift = 0.08;
          scene.skyAtmosphere.saturationShift = 0.15;
          scene.skyAtmosphere.brightnessShift = -0.1;
        }
        if (scene.sun) scene.sun.show = false;
        if (scene.moon) scene.moon.show = false;

        const controller = scene.screenSpaceCameraController;
        controller.minimumZoomDistance = 1_500;
        controller.maximumZoomDistance = 40_000_000;
        controller.inertiaSpin = 0.92;
        controller.inertiaTranslate = 0.9;
        controller.inertiaZoom = 0.8;

        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
        );

        const credit = viewer.cesiumWidget.creditContainer as HTMLElement;
        credit.style.fontSize = "9px";
        credit.style.opacity = "0.5";

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(78, 20, 34_000_000),
        });
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(78, 20, OVERVIEW_HEIGHT),
          duration: 2.6,
          easingFunction: Cesium.EasingFunction.CUBIC_OUT,
        });
        lastInputRef.current = performance.now();

        handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        const markInput = () => {
          lastInputRef.current = performance.now();
        };
        for (const type of [
          Cesium.ScreenSpaceEventType.LEFT_DOWN,
          Cesium.ScreenSpaceEventType.RIGHT_DOWN,
          Cesium.ScreenSpaceEventType.MIDDLE_DOWN,
          Cesium.ScreenSpaceEventType.WHEEL,
          Cesium.ScreenSpaceEventType.PINCH_START,
        ]) {
          handler.setInputAction(markInput, type);
        }

        if (propsRef.current.mode === "picker") {
          handler.setInputAction((click: { position: import("cesium").Cartesian2 }) => {
            const p = propsRef.current;
            if (p.mode !== "picker") return;
            const ray = viewer.camera.getPickRay(click.position);
            const cartesian =
              (ray && scene.globe.pick(ray, scene)) ??
              viewer.camera.pickEllipsoid(click.position, scene.globe.ellipsoid);
            if (!cartesian) return;
            const carto = Cesium.Cartographic.fromCartesian(cartesian);
            if (!carto) return;
            p.onPick(Cesium.Math.toDegrees(carto.latitude), Cesium.Math.toDegrees(carto.longitude));
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          scene.canvas.style.cursor = "crosshair";
        } else {
          handler.setInputAction((move: { endPosition: import("cesium").Cartesian2 }) => {
            const p = propsRef.current;
            if (p.mode !== "public") return;
            const id = pickedPlaceId(Cesium, scene.pick(move.endPosition));
            scene.canvas.style.cursor = id ? "pointer" : "grab";
            if (id !== hoveredRef.current) p.onHover(id);
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

          handler.setInputAction((click: { position: import("cesium").Cartesian2 }) => {
            const p = propsRef.current;
            if (p.mode !== "public") return;
            const id = pickedPlaceId(Cesium, scene.pick(click.position));
            if (id) p.onSelect(id);
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          scene.canvas.style.cursor = "grab";

          const spinAxis = Cesium.Cartesian3.UNIT_Z;
          removePreRender = scene.preRender.addEventListener(() => {
            if (selectedRef.current) return;
            if (performance.now() - lastInputRef.current < IDLE_BEFORE_SPIN_MS) return;
            if (viewer.camera.positionCartographic.height < 6_000_000) return;
            viewer.camera.rotate(spinAxis, -0.0009);
          });
        }

        setReady(true);
        propsRef.current.onReady?.();
      } catch (err) {
        if (destroyed) return;
        const msg = err instanceof Error ? err.message : "Could not start the globe";
        propsRef.current.onError?.(msg);
        setFailed(true);
      }
    })();

    return () => {
      destroyed = true;
      abort.abort();
      handler?.destroy();
      removePreRender?.();
      removeRenderError?.();
      detachResize?.();
      const viewer = viewerRef.current;
      if (viewer && !viewer.isDestroyed()) {
        viewer.useDefaultRenderLoop = false;
        viewer.destroy();
      }
      viewerRef.current = null;
      entityMap.clear();
      setReady(false);
    };
  }, [mode]);

  const publicPlaces = props.mode === "public" ? props.places : null;
  const publicSelectedId = props.mode === "public" ? props.selectedId : null;

  useEffect(() => {
    if (!ready || !publicPlaces) return;
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewer || !Cesium || viewer.isDestroyed()) return;

    const map = entityMapRef.current;
    for (const entity of map.values()) viewer.entities.remove(entity);
    map.clear();

    const ground = Cesium.HeightReference.CLAMP_TO_GROUND;
    const byDistance = new Cesium.NearFarScalar(1.5e5, 1.25, 2.5e7, 0.75);

    for (const place of publicPlaces) {
      const id = place.id;
      const visited = place.category === "visited";
      const position = Cesium.Cartesian3.fromDegrees(place.longitude, place.latitude, 0);
      const phase = phaseFromId(id);
      const base = Cesium.Color.fromCssColorString(visited ? VIOLET : BLUE);
      const emphasis = () =>
        selectedRef.current === id ? 1.3 : hoveredRef.current === id ? 1.15 : 1;

      // Halo first so the pin draws above it; both map back to the same place when picked.
      const halo = viewer.entities.add({
        id: `${id}${HALO_SUFFIX}`,
        position,
        billboard: {
          image: haloDataUrl(visited),
          heightReference: ground,
          disableDepthTestDistance: DEPTH_TEST_OFF_WITHIN,
          scaleByDistance: byDistance,
          scale: new Cesium.CallbackProperty(
            () => (0.32 + pulse(phase, 2400) * 0.28) * emphasis(),
            false,
          ),
          color: new Cesium.CallbackProperty(() => {
            const p = pulse(phase, 2400);
            const boost = selectedRef.current === id ? 0.25 : 0;
            return base.withAlpha(Math.min(1, (visited ? 0.75 * (1 - p) : 0.3 + 0.6 * p) + boost));
          }, false),
        },
      });

      const pin = viewer.entities.add({
        id,
        name: place.name,
        position,
        billboard: {
          image: pinDataUrl(visited),
          heightReference: ground,
          disableDepthTestDistance: DEPTH_TEST_OFF_WITHIN,
          scaleByDistance: byDistance,
          scale: new Cesium.CallbackProperty(() => 0.42 * emphasis(), false),
        },
        label: {
          text: place.name,
          font: "600 13px system-ui, -apple-system, sans-serif",
          fillColor: Cesium.Color.fromCssColorString("#f4f4f5"),
          outlineColor: Cesium.Color.fromCssColorString("#07080b"),
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -24),
          show: new Cesium.CallbackProperty(
            () => selectedRef.current === id || hoveredRef.current === id,
            false,
          ),
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString("rgba(18,20,26,0.85)"),
          backgroundPadding: new Cesium.Cartesian2(10, 6),
          heightReference: ground,
          disableDepthTestDistance: DEPTH_TEST_OFF_WITHIN,
        },
      });

      map.set(`${id}${HALO_SUFFIX}`, halo);
      map.set(id, pin);
    }
  }, [ready, publicPlaces]);

  const flownToRef = useRef<{ id: string; longitude: number; latitude: number } | null>(null);
  useEffect(() => {
    if (!ready || props.mode !== "public") return;
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewer || !Cesium || viewer.isDestroyed()) return;

    if (!publicSelectedId) {
      const last = flownToRef.current;
      if (last) {
        flownToRef.current = null;
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(last.longitude, last.latitude, OVERVIEW_HEIGHT),
          duration: 1.6,
          easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
        });
        lastInputRef.current = performance.now();
      }
      return;
    }
    if (flownToRef.current?.id === publicSelectedId) return;

    const place = publicPlaces?.find((p) => p.id === publicSelectedId);
    if (!place) return;
    flownToRef.current = { id: place.id, longitude: place.longitude, latitude: place.latitude };
    lastInputRef.current = performance.now();
    viewer.camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(place.longitude, place.latitude, 0), 0),
      {
        offset: new Cesium.HeadingPitchRange(
          0,
          Cesium.Math.toRadians(-58),
          place.category === "visited" ? 1_100_000 : 2_000_000,
        ),
        duration: 2,
        easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
      },
    );
  }, [ready, props.mode, publicSelectedId, publicPlaces]);

  const resetSignal = props.mode === "public" ? props.resetSignal : undefined;
  useEffect(() => {
    if (!ready || resetSignal === undefined || resetSignal === 0) return;
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewer || !Cesium || viewer.isDestroyed()) return;
    flownToRef.current = null;
    lastInputRef.current = performance.now();
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(78, 20, OVERVIEW_HEIGHT),
      duration: 1.8,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });
  }, [ready, resetSignal]);

  const pickerDraft = props.mode === "picker" ? props.draftPosition : null;
  useEffect(() => {
    if (!ready || props.mode !== "picker") return;
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewer || !Cesium || viewer.isDestroyed()) return;

    if (!pickerDraft) return;

    const violet = Cesium.Color.fromCssColorString(VIOLET);
    const position = Cesium.Cartesian3.fromDegrees(pickerDraft.longitude, pickerDraft.latitude, 0);
    const ground = Cesium.HeightReference.CLAMP_TO_GROUND;
    const halo = viewer.entities.add({
      position,
      billboard: {
        image: haloDataUrl(true),
        heightReference: ground,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scale: new Cesium.CallbackProperty(() => 0.35 + pulse(0, 1600) * 0.3, false),
        color: new Cesium.CallbackProperty(
          () => violet.withAlpha(0.8 * (1 - pulse(0, 1600))),
          false,
        ),
      },
    });
    const pin = viewer.entities.add({
      position,
      billboard: {
        image: pinDataUrl(true, true),
        scale: 0.5,
        heightReference: ground,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    return () => {
      if (viewer.isDestroyed()) return;
      viewer.entities.remove(halo);
      viewer.entities.remove(pin);
    };
  }, [ready, props.mode, pickerDraft]);

  const flyLat = props.mode === "picker" ? props.flyTarget?.latitude : undefined;
  const flyLon = props.mode === "picker" ? props.flyTarget?.longitude : undefined;
  useEffect(() => {
    if (!ready || flyLat == null || flyLon == null) return;
    const viewer = viewerRef.current;
    const Cesium = cesiumRef.current;
    if (!viewer || !Cesium || viewer.isDestroyed()) return;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(flyLon, flyLat, 1_200_000),
      duration: 1.6,
      easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
    });
  }, [ready, flyLat, flyLon]);

  return (
    <div
      className={cn(
        "relative min-h-[280px] w-full overflow-hidden rounded-2xl bg-[#07080b] sm:min-h-[320px]",
        props.className,
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 size-full transition-opacity duration-1000 [&_.cesium-viewer]:!size-full [&_.cesium-viewer-bottom]:!hidden [&_canvas]:touch-none",
          ready ? "opacity-100" : "opacity-0",
        )}
        aria-label="Interactive 3D Earth globe"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_120px_40px_rgba(7,8,11,0.85)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-1/4 -bottom-1/2 h-full bg-[radial-gradient(ellipse_at_center,rgba(139,124,248,0.18),transparent_60%)]"
      />
      {!ready && !failed ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center text-sm text-[var(--text-muted)]">
            <div className="relative mx-auto mb-4 h-12 w-12">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent-violet)]/25" />
              <span className="absolute inset-2 rounded-full border border-[var(--accent-violet)]/60 bg-[radial-gradient(circle_at_30%_30%,rgba(139,124,248,0.6),rgba(7,8,11,0.9))]" />
            </div>
            Warming up the globe…
          </div>
        </div>
      ) : null}
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-[var(--text-secondary)]">
          The globe couldn&apos;t start on this device. Everything is still listed below.
        </div>
      ) : null}
    </div>
  );
}