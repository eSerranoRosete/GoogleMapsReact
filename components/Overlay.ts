type OverlayProps = {
  svgStream: string;
  bounds: google.maps.LatLngBounds;
  map: google.maps.Map;
  background?: string;
  trees?: string;
  showBorders?: boolean;
  onSegmentClick?: (e: any) => void;
  onReady?: () => void;
};

/**
 * Manages google maps overlays used in site plans.
 */
export class Overlay extends google.maps.OverlayView {
  private _bounds: google.maps.LatLngBounds;
  private _backgroundUrl?: string;
  private _treesUrl?: string;
  private _onSegmentClick?: (e: any) => void;
  private _svgStream: string;
  private _div?: HTMLElement;
  private _onReady?: () => void;
  private _showBorders?: boolean;

  /**
   * Initializing Object
   */
  constructor({
    svgStream,
    bounds,
    map,
    background,
    trees,
    showBorders,
    onSegmentClick,
    onReady,
  }: OverlayProps) {
    super();
    (this._svgStream = svgStream), (this._bounds = bounds);

    this._showBorders = showBorders;
    this.setValues({ zIndex: 998 });
    this.setMap(map);
    this._onSegmentClick = onSegmentClick;
    this._backgroundUrl = background;
    this._treesUrl = trees;
    this._onReady = onReady;
  }

  public onAdd(): void {
    this._div = document.createElement("div");
    this._div.id = "overlayContainer";
    this._div.style.width = "100%";
    this._div.style.height = "100%";
    this._div.style.position = "absolute";

    let string: string = `<style> #overlayContainer svg {width: 100%; height: 100%; position: absolute; ${
      this._showBorders ? "border: 1px dashed black" : ""
    }</style>`;

    if (this._backgroundUrl) {
      string += `<img src="${this._backgroundUrl}" style="position: absolute; width: 100%; height: 100%; object-fit: contain; pointer-events: none />`;
    }

    if (this._svgStream) {
      string +=
        '<svg width="0" height="0" id="eduardo"><defs><filter id="chip_shadow"><feDropShadow dx="0.2" dy="0.2" stdDeviation="0.5" flood-opacity="0.5" flood-color="black"></feDropShadow></filter><filter id="segment_shadow"><feDropShadow dx="0.4" dy="0.4" stdDeviation="0.5" flood-opacity="0.5" flood-color="black"></feDropShadow></filter></defs></svg>' +
        this._svgStream;
    }

    if (this._treesUrl) {
      string += `<img src="${this._treesUrl}" style="position: absolute; width: 100%; height: 100%; object-fit: contain; pointer-events: none" />`;
    }

    this._div.innerHTML = string;

    const panes = super.getPanes();
    panes?.floatPane.appendChild(this._div);

    if (this._onSegmentClick) {
      addEvent('[id^="seg-"]', "click", this._onSegmentClick);
    }

    this._onReady && this._onReady();
  }

  public draw(): void {
    const projection = super.getProjection();
    const sw = projection.fromLatLngToDivPixel(this._bounds.getSouthWest());
    const ne = projection.fromLatLngToDivPixel(this._bounds.getNorthEast());

    if (this._div) {
      const s = this._div.style;
      s.left = sw!.x + "px";
      s.top = ne!.y + "px";
      s.width = ne!.x - sw!.x + "px";
      s.height = sw!.y - ne!.y + "px";
    }
  }

  public onRemove(): void {
    if (this._div) {
      this._div.parentNode?.removeChild(this._div);
    }
  }
}

function addEvent(target: string, type: string, handler: any) {
  const targets =
    typeof target === "string"
      ? Array.from(document.querySelectorAll(target))
      : [target];
  targets.forEach((t) => {
    t.addEventListener(type, handler);
  });
}
