export function getCesiumIonToken(): string | undefined {
  return process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN?.trim() || undefined;
}

export const CESIUM_BASE_URL = "/cesium/";