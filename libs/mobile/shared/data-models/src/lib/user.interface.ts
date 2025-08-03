export interface UserSettings {
  chatMessageNotifications?: boolean;
  showTimeline?: boolean;
  likedMessageNotifications?: boolean;
  optCommunications?: boolean;
  sameAgeGenderFilter?: boolean;
  perferredRunTrackingMethod?: string;

  raceAnnouncements?: boolean;
  useRobotVoice: boolean;
  comment_notifications_enabled?: boolean;
  badge_email_setting?: boolean;
  challenge_email_setting?: boolean;
  race_progress_email_setting?: boolean;
  goal_progress_email_setting?: boolean;
  selfie_privacy_setting?: string;
  race_share_setting?: string;
  achievement_share_setting?: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  type: string;
  state?: string;
  isActive?: boolean;
  push_device_tokens?: Array<string>;
  work_history?: Array<object>;
  uploaded_documents?: Array<object>;
  last_known_location?: any;
  forgot_password_hash?: string;
  user_setup_passcode?: string;
  settings?: UserSettings;
  age?: number;
  gender?: string;
  training?: any;
  has_authenticated?: boolean;
  is_participant?: boolean;
  strava_information?: any;
  selfie_privacy_setting?: string;
  race_share_setting?: string;
  achievement_share_setting?: string;
  user_timezone?: string;
  profile_photo_link?: string;
  last_checked_strava_time?: Date;
  current_todo_streak?: number;
  username?: string;
  user_why_description?: string;
  current_streak?: number;
  creation_date?: Date;

  has_completed_today_tutorial?: boolean;
  has_completed_journal_tutorial?: boolean;
  has_completed_progress_tutorial?: boolean;
  has_completed_friends_tutorial?: boolean;
  has_completed_challenges_tutorial?: boolean;
  has_reminders_on?: boolean;
  has_reminder_sunday?: boolean;
  has_reminder_monday?: boolean;
  has_reminder_tuesday?: boolean;
  has_reminder_wednesday?: boolean;
  has_reminder_thursday?: boolean;
  has_reminder_friday?: boolean;
  has_reminder_saturday?: boolean;
  reminder_time?: Date;
  times_exercise_per_week?: number;
  user_why_filled_date?: Date;
  has_annual_pass?: boolean;
  raa_team_tag?: string;
  current_ticket_count_summer?: number;

  roles: string[];
}
