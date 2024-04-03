import { useEffect, useMemo, useState } from "react";
import { Overlay } from "./Overlay";

type VUOverlayProps = {
  bounds: google.maps.LatLngBoundsLiteral;
  overlayControls?: boolean;
  map: google.maps.Map;
};

export const VUOverlay = ({ bounds, overlayControls, map }: VUOverlayProps) => {
  const [stream, setStream] = useState<string | null>(null);

  const overlay = useMemo(() => {
    if (!stream) return null;

    const customOverlay = new Overlay({
      map,
      bounds: new google.maps.LatLngBounds(bounds),
      svgStream: stream,
      background: assets.background,
      showBorders: overlayControls,
    });

    customOverlay.setMap(map);

    return customOverlay;
  }, [stream, bounds]);

  useEffect(() => {
    loadStream(assets.segments).then((data) => setStream(data));
  }, []);

  return null;
};

const loadStream = async (url: string) => {
  const response = await fetch(url);
  return await response.text();
};

const assets = {
  background:
    "https://utfs.io/f/a614b0bf-b730-420d-a04f-9d1800eb5c3a-p4i9qv.svg",
  segments: "https://utfs.io/f/3e3d9a32-b8c7-42be-9589-b52684f26392-5slpbo.svg",
};
