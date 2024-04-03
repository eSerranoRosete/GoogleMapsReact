import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface IFProps {
  map: google.maps.Map;
  infoBoxOrigin: google.maps.LatLngLiteral;
  infoBox: ReactNode;
}

export default function InfoBox({ map, infoBoxOrigin, infoBox }: IFProps) {
  const [isReady, setIsReady] = useState<google.maps.InfoWindow>();

  const infoBoxId = "gMap-infobox-root";

  const infoWindow = useMemo(() => {
    const infoW = new google.maps.InfoWindow({
      content: `<div id="${infoBoxId}" />`,
      zIndex: 9999,
    });

    infoW.addListener("domready", () => {
      setIsReady(infoW);
    });

    return infoW;
  }, []);

  useEffect(() => {
    infoWindow.setPosition(new google.maps.LatLng(infoBoxOrigin));
    infoWindow.open(map);

    return () => infoWindow.close();
  }, [infoBoxOrigin.lat, infoBoxOrigin.lng]);

  return (
    <>
      {isReady &&
        createPortal(
          infoBox,
          document.getElementById(infoBoxId) as HTMLElement
        )}
    </>
  );
}
