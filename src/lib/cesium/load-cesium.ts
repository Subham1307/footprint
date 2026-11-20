import { CESIUM_BASE_URL, getCesiumIonToken } from "@/lib/cesium/env";

type CesiumModule = typeof import("cesium");

let modulePromise: Promise<CesiumModule> | null = null;

export function loadCesium(): Promise<CesiumModule> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cesium can only load in the browser"));
  }

  const w = window as Window & { CESIUM_BASE_URL?: string };
  if (!w.CESIUM_BASE_URL) w.CESIUM_BASE_URL = CESIUM_BASE_URL;

  if (!modulePromise) {
    modulePromise = import("cesium").then((mod) => {
      const token = getCesiumIonToken();
      if (token) mod.Ion.defaultAccessToken = token;
      return mod;
    });
  }

  return modulePromise;
}