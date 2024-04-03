"use client";

import { InfoWindowF } from "@react-google-maps/api";
import { ReactNode, useState } from "react";

type CustomMarkerProps = {
  map: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  defaultOpen?: boolean;

  children?: (isOpen: boolean, setOpen: () => void) => ReactNode;
};
export const CustomMarker = ({
  map,
  position,
  defaultOpen,
  children,
}: CustomMarkerProps) => {
  const [open, setOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <InfoWindowF
      anchor={new google.maps.Marker({ map, position, visible: false })}
    >
      {children?.(!!open, toggleOpen)}
    </InfoWindowF>
  );
};
