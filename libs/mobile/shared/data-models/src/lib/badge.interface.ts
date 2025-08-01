export interface ProjectBadge {
  id?: string;
  distance?: number;
  project_id?: string;
  badge_id?: string;
  badge_type?: string;
}

export interface Badge {
  badge_group_id?: string;
  id?: string;
  name?: string;
  image_link?: string;
  grey_image_link?: string;
  is_hidden?: boolean;
  is_unlocked?: boolean;
  description?: string;
  badge_extra_data?: any;
  unlocked_date?: Date;
  badge_badge_type?:
    | 'cumulative_distance'
    | 'activity'
    | 'streak'
    | 'non_distance_activity'
    | 'total_time'
    | 'total_seasons'
    | 'variety'
    | 'single_distance'
    | 'active_days';
  ProjectBadge?: ProjectBadge;
  badge_reward_info?: any;
  badge_distance?: number;
  badge_type?: string;
  badge_order?: number;
  progress?: Record<string, number>;
}

export interface BadgeGroup {
  id?: string;
  name?: string;
  progress?: number;
  badge_group_order?: number;
  badge_group_type?: string;
  badges?: Array<Badge>;
}

export interface UserUnlockedBadge extends Badge {
  unlocked_badge?: Date;
  has_congratulated?: boolean;
  count?: number;
  last_congratulated?: Date;
  first_unlocked_date?: Date;
}
