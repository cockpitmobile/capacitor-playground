export interface TrackedActivity {
  distance: number;
  startTime: Date;
  endTime?: Date;
  locations: { lat: number; lon: number; }[];
}
