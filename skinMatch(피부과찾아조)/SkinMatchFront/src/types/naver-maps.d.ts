declare namespace naver {
  namespace maps {
    interface MapOptions {
      center: LatLng;
      zoom: number;
      mapTypeControl?: boolean;
      mapDataControl?: boolean;
      logoControl?: boolean;
      scaleControl?: boolean;
      zoomControl?: boolean;
    }

    class Map {
      constructor(element: HTMLElement | string, options: MapOptions);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
      setZoom(zoom: number): void;
      getZoom(): number;
      destroy(): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface MarkerOptions {
      position: LatLng;
      map: Map;
      title?: string;
      icon?: string;
    }

    class Marker {
      constructor(options: MarkerOptions);
      setPosition(latlng: LatLng): void;
      getPosition(): LatLng;
      setMap(map: Map | null): void;
      getMap(): Map;
    }

    namespace Event {
      function addListener(
        target: any,
        type: string,
        listener: (...args: any[]) => void
      ): void;
      function removeListener(listener: any): void;
    }

    interface InfoWindowOptions {
      content: string;
      position?: LatLng;
      pixelOffset?: Point;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      maxWidth?: number;
    }

    class InfoWindow {
      constructor(options: InfoWindowOptions);
      open(map: Map, marker?: Marker): void;
      close(): void;
      setContent(content: string): void;
      getContent(): string;
    }

    class Point {
      constructor(x: number, y: number);
    }
  }
}

interface Window {
  naver: typeof naver;
}
