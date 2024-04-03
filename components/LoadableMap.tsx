import { GoogleMap } from "@react-google-maps/api";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { VUOverlay } from "./VuOverlay";
import { CustomMarker } from "./CustomMarker";

export type LoadableMapProps = {
  options?: google.maps.MapOptions;

  //Overlay
  overlayBounds?: google.maps.LatLngBoundsLiteral;
  overlayControls?: boolean;

  //Origin
  origin?: MapOrigin;

  onClick?: (e: google.maps.MapMouseEvent) => void;
  onReady?: () => void;
};

type MapOrigin = {
  position: google.maps.LatLngLiteral;
  visible?: boolean;
  url?: string;
};

export type LoadableMapRef = {
  map: google.maps.Map | null;

  reCenter: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  focusSegment: (latLng: google.maps.LatLngLiteral | null) => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  clearOverlayHandles: () => void;
};

const LoadableMap = forwardRef<LoadableMapRef, LoadableMapProps>(
  (props, ref) => {
    // Map Instance
    const [map, setMap] = useState<google.maps.Map | null>(null);

    // Overlay Controls
    const SWPoint = useRef<google.maps.Marker | null>(null);
    const NEPoint = useRef<google.maps.Marker | null>(null);

    // Expose Map methods
    useImperativeHandle(
      ref,
      () => ({
        map,
        reCenter,
        zoomIn,
        zoomOut,
        focusSegment,
        rotateLeft,
        rotateRight,
        clearOverlayHandles,
      }),
      [map]
    );

    // Initialize Map
    const onLoad = useCallback((map: google.maps.Map) => {
      setMap(map);

      // Attach Click Event Listener
      map.addListener("click", onMapClick);

      if (props.overlayBounds && props.overlayControls) {
        const bounds = new google.maps.LatLngBounds(props.overlayBounds);

        setSouthWest(bounds.getSouthWest().toJSON(), map);
        setNorthEast(bounds.getNorthEast().toJSON(), map);
      }

      //Initialize Origin Marker
      if (props.origin && props.origin.visible) {
        const icon = {
          url: props.origin.url || "",
          size: new google.maps.Size(150, 150),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(24, 24),
          scaledSize: new google.maps.Size(50, 50),
        };

        new google.maps.Marker({
          position: props.origin.position,
          map,
          icon,
        });
      }

      props.onReady?.();
    }, []);

    const setSouthWest = (
      position: google.maps.LatLngLiteral,
      map: google.maps.Map
    ) => {
      if (!SWPoint.current) {
        SWPoint.current = new google.maps.Marker({
          position,
          map,
          draggable: true,
          zIndex: 999,
          visible: true,
        });

        SWPoint.current.addListener("dragend", () => {
          if (!SWPoint.current) return;

          // const coords = SWPoint.current.getPosition()?.toJSON() as google.maps.LatLngLiteral;

          // props.setSWPoint(coords);
        });
      }
    };

    const setNorthEast = (
      position: google.maps.LatLngLiteral,
      map: google.maps.Map
    ) => {
      if (!NEPoint.current) {
        NEPoint.current = new google.maps.Marker({
          position,
          map,
          draggable: true,
          zIndex: 999,
        });

        NEPoint.current.addListener("dragend", () => {
          if (!NEPoint.current) return;

          // const coords = NEPoint.current
          //   .getPosition()
          //   ?.toJSON() as google.maps.LatLngLiteral;

          // props.setNEPoint(coords);
        });
      }
    };

    const clearOverlayHandles = () => {
      SWPoint.current?.setMap(null);
      SWPoint.current = null;
      NEPoint.current?.setMap(null);
      NEPoint.current = null;
    };

    const onMapClick = (e: google.maps.MapMouseEvent) => {
      props.onClick?.(e);
    };

    const onUnmount = useCallback((map: google.maps.Map) => {
      setMap(null);
    }, []);

    const reCenter = useCallback(() => {
      const rotationCollides = rotationCollidesBounds(
        props.options?.heading || 0
      );

      if (props.overlayBounds && !rotationCollides) {
        map?.fitBounds(props.overlayBounds);
      } else if (props.options?.center) {
        map?.setCenter(props.options.center);
        map?.setZoom(props.options.zoom || 15);
      }
    }, [map]);

    const zoomIn = useCallback(() => {
      const zoom = map?.getZoom();

      if (zoom) {
        map?.setZoom(zoom + 1);
      }
    }, [map]);

    const zoomOut = useCallback(() => {
      const zoom = map?.getZoom();

      if (zoom && zoom > 1) {
        map?.setZoom(zoom - 1);
      }
    }, [map]);

    const focusSegment = useCallback(
      (latLng: google.maps.LatLngLiteral | null) => {
        if (latLng) {
          map?.setCenter(latLng);
          map?.setZoom(19);
        } else {
          reCenter();
        }
      },
      [map]
    );

    const rotateLeft = useCallback(() => {
      map?.setHeading(map.getHeading()! - 1);
    }, [map]);

    const rotateRight = useCallback(() => {
      map?.setHeading(map.getHeading()! + 1);
    }, [map]);

    return (
      <GoogleMap
        options={props.options}
        mapContainerClassName="h-full w-full rounded-xl"
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <CustomMarker
          map={map}
          position={{ lat: 34.074900966256585, lng: -117.56396798658028 }}
        >
          {(isOpen, toggleOpen) => (
            <div
              className="bg-white rounded-lg w-full cursor-pointer shadow-lg "
              onClick={toggleOpen}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                  +
                </span>
                <div className="text-sm font-medium flex-shrink-0">
                  Custom Marker
                </div>
              </div>
              {isOpen && (
                <div className="max-w-sm mt-2 !text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Commodi earum voluptates ipsa minima mollitia? Unde alias
                  deleniti reiciendis modi dolorum?
                </div>
              )}
            </div>
          )}
        </CustomMarker>
        {map && props.overlayBounds && (
          <VUOverlay
            overlayControls={props.overlayControls}
            bounds={props.overlayBounds}
            map={map}
          />
        )}
      </GoogleMap>
    );
  }
);

export default LoadableMap;

const rotationCollidesBounds = (heading: number) => {
  return heading <= -90 || heading > 90;
};
