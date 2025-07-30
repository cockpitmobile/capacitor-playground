export interface Activity {
  // photos?: Array<EventResultPhoto>;
  id?: string;
  project_id?: string;
  user_id?: string;
  start_time?: Date;
  stop_time?: Date;
  end_time?: Date;
  challenge_id?: string;
  challenge_run_time?: number;
  challenge_end_time?: Date;
  challenge_time?: string;
  event_distance_id?: string;
  activity_type?: string;
  distance_ran?: number;
  distance_units?: string;
  distance_ran_race_units?: number;
  pace_minutes?: number;
  // distance_locations?: Array<UserLocation>;
  image_link?: string;
  image_linkSmall?: string;
  image_linkBig?: string;
  training_session_id?: string;
  strava_information?: any;
  manual_image_link?: string;
  image_time?: Date;
  is_image_approved?: boolean;
  is_shared_with_teams?: boolean;
  time_completed_at?: Date;
  is_manual?: boolean;
  is_practice?: boolean;
  user_location_poly?: string;
  user?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    age?: number;
    gender?: string;
    state?: string;
    profile_photo_link?: string;
    badge_count?: number;
    has_annual_pass?: boolean;
    raa_team_tag?: string;
  }; // Don't send this up, it comes down
  request_info?: {
    start_time?: Date;
    end_time?: Date;
    time?: string;
    message?: string;
    image_link?: string;
    status?: string;
    email?: string;
    distance_ran?: number;
    distance_units?: string;
    app_version?: string;
    os?: string;
    build_version?: string;
    device?: string;
    activity_type?: string;
  };
  reactions?: Array<any>;
  currentUserReaction?: any;
  tracker_type?: string;
  time?: string;
  pace?: any;
  // challenge?: Challenge;
  storage?: {
    // locations: Array<UserLocation>;
    polyline?: string;
    averageAccuracy?: number;
    total: number;
    pausingIndicies: Array<number>;
  };
  strava_run_id?: string;
  activity_name?: string;
  run_time?: number;
  event_result_id?: string;
  description?: string;
  description_public?: boolean;
  user_effort?: number;
  date_added_to_challenge?: Date;
  comment?: string;
  // pets?: Array<Pet>;
  selfie?: any; // Used only for submission of in app trackers
  petIds?: Array<string>; // Used only for submission of in app trackers
  seconds?: number;
  comment_count?: number;
}
