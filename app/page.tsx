"use client";

import GoogleMapReact from "@/components/GoogleMapReact";
import { LoadableMapRef } from "@/components/LoadableMap";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRef, useState } from "react";

export default function Home() {
  const mapRef = useRef<LoadableMapRef | null>(null);

  const [overlayControls, setOverlayControls] = useState<boolean>(false);

  return (
    <main className="p-6 w-full h-dvh flex gap-10">
      <div className="w-1/2 h-full rounded-lg shadow-xl border border-zinc-800">
        <GoogleMapReact
          ref={mapRef}
          loadingComponent={<></>}
          options={{
            disableDefaultUI: true,
            mapId: "1d46f79dbf26bb7f",
            clickableIcons: false,
            heading: -90,
            center: {
              lat: 34.074390330178595,
              lng: -117.56318437104031,
            },
            zoom: 19,
          }}
          overlayBounds={{
            north: 34.075129221441024,
            south: 34.07350472359914,
            east: -117.56393774990839,
            west: -117.56194111132965,
          }}
          overlayControls={overlayControls}
          onClick={(e) => console.log(e.latLng?.toJSON())}
        />
      </div>
      <div className="w-full max-w-md rounded-md p-6 gap-3 flex flex-col">
        <Button onClick={() => mapRef.current?.reCenter()}>Re-center</Button>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => mapRef.current?.zoomIn()}>Zoom-in</Button>
          <Button onClick={() => mapRef.current?.zoomOut()}>Zoom-out</Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => mapRef.current?.rotateLeft()}>
            Rotate Left
          </Button>
          <Button onClick={() => mapRef.current?.rotateRight()}>
            Rotate Right
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            onCheckedChange={(checked) => setOverlayControls(checked)}
          />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
      </div>
    </main>
  );
}
