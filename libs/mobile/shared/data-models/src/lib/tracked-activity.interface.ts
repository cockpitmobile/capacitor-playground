export interface CurrentTrackedActivity {
  startTime: Date,
  endTime?: Date,
  distance: number,
  locations: { lat: number; long: number; }[]
}
