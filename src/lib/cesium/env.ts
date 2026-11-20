export function getCesiumIonToken(): string | undefined {
  // Static reads so Next inlines them into the client bundle.
  const token =
    process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_CESIUM_ION_ACCESS_KEY;
  return token?.trim() || undefined;
}

export const CESIUM_BASE_URL = "/cesium/";