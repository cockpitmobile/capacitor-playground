import { Badge, BadgeGroup } from './badge.interface';
import { Challenge } from './challenge.interface';
import { Activity } from './activity.interface';

export interface ProjectParticipant {
  id: string;
  project_id: string;
  user_id: string;
  project_goal_distance: number;
  project_goal_distance_units: string;
  cohort_index?: number;
  cohort_start_date?: Date;
  cohort_end_date?: Date;
  has_seen_goal_confirmation?: boolean;
}

export interface RAAEvent {
  scavengerHunts?: any;
  id?: string;
  title: string;
  badge_id?: string;
  creation_date?: Date;
  description: string;
  location: string;
  location_coordinates: any;
  start_date?: Date;
  estimated_end_time?: Date;
  time_string?: string;
  date_string?: string;
  type: string;
  customer_chat_room_id?: string;
  internal_chat_room_id?: string;
  company_id: string;
  project_files?: Array<any>;
  is_archived?: boolean;
  invite_code?: string;
  linked_documents?: Array<any>;
  event_badge_logo?: any;
  race_banner_image_link?: string;
  sponsor_logos?: Array<any>;
  race_distance?: number;
  race_distance_units?: string;
  race_primary_color?: string;
  race_secondary_color?: string;
  onboarding_image_link?: string;
  onboarding_background_image_link?: string;
  onboarding_background_image_dark_link?: string;
  race_event_type?: string;
  badge_groups?: Array<BadgeGroup>;
  event_details_link?: string;
  event_sign_up_link?: string;
  // event_distances?: Array<EventDistance>;
  event_results?: Array<Activity>;
  gallery_results?: Array<Activity>;
  open_practice_time?: Date;
  config?: {
    distance_string?: string;
    how_description?: string;
    edit_personal_goal?: string;
    edit_team_goal?: string;
    race_button?: string;
    race_day_string?: string;
    date_string?: string;
    race_animation_name?: string;
    end_of_race_banner_link?: string;
    end_of_race_banner_text?: string;
    end_of_race_banner_text_joined?: string;
    end_of_race_days_before_banner?: number;
    is_external_event?: boolean;
    hide_challenges?: boolean;
    hide_badge_progress?: boolean;
    hide_goal_editing?: boolean;
  };
  challenges?: Array<Challenge>;
  project_selfie_filter_image_link?: string;
  ProjectParticipant?: ProjectParticipant;
  project_notification_info?: {
    body: string;
    title: string;
  };
  cohort_data?: Array<{
    cohort_cutoff_date: Date;
    cohort_start_date: Date;
    cohort_end_date: Date;
  }>;
  next_season_project_id?: string;
  badges?: Array<Badge>;
  sweepstakes_info?: {
    prizes_link?: string;
    terms_conditions_link?: string;
    prize_description?: string;
    below_prize_description?: string;
    terms_description?: string;
    grand_prize_date?: Date;
    invite_button?: string;
  };
  sweepstakes_title_image_link?: string;
  sweepstakes_prize_image_link?: string;
  accepted_activity_types?: string[];
  default_page?: string;
  new_account_link?: string;
  app_welcome_text?: string;
  animation_body?: string;
  animation_function?: string;
}
