"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import { ReactNode, forwardRef } from "react";

import Loadable from "react-loadable";
import { LoadableMapProps, LoadableMapRef } from "./LoadableMap";

interface GoogleMapProps extends LoadableMapProps {
  loadingComponent: ReactNode;
}

const GoogleMapReact = forwardRef<LoadableMapRef, GoogleMapProps>(
  ({ loadingComponent, ...props }, ref) => {
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: "AIzaSyAvLBpS87J12GAJTW2gIbCs7-3PM8S42X4",
    });

    const LoadableMap = Loadable({
      loader: () => import("./LoadableMap"),
      loading: () => loadingComponent,
      render(loaded, props) {
        const Component = loaded.default;
        return <Component ref={ref as any} {...props} />;
      },
    });

    return <>{isLoaded && <LoadableMap {...props} />}</>;
  }
);

export default GoogleMapReact;
