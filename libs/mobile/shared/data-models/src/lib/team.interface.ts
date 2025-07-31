import { Activity } from './activity.interface';
import { User } from './user.interface';



export interface RaceTeamMember {
  created_at?: string;
  id?: string;
  is_leader?: boolean;
  last_viewed?: Date;
  post_notification_enabled?: boolean;
  race_team_id?: string;
  user_id?: string;
}

export interface RaceTeam {
  id?: string;
  name?: string;
  icon?: string;
  code?: string;
  is_featured?: boolean;
  race_team_extra_info?: any;
  team_image?: string;
  team_description?: string;
  learn_more_link?: string;
  userEventResults?: Array<{ user: User; eventResult?: Activity }>;
  memberCount?: number;
  last_updated_time?: Date;
  user_last_viewed_time?: Date;
  totalDistance?: number;
  ordinal?: number;
  lock_editing?: boolean;
  RaceTeamMember?: RaceTeamMember;
  isMember?: boolean;
  // currentTeamGoal?: TeamGoal;
}

export interface RaceTeamCompare {
  id?: string;
  name?: string;
  icon?: string;
  code?: string;
  is_featured?: boolean;
  race_team_extra_info?: any;
  team_image?: string;
  team_description?: string;
  learn_more_link?: string;
  userEventResults?: Array<{ user: User; eventResult?: Activity }>;
  memberCount?: number;
  last_updated_time?: Date;
  user_last_viewed_time?: Date;
  totalDistance?: number;
  ordinal?: number;
  lock_editing?: boolean;
  RaceTeamMember?: RaceTeamMember;
  text_color?: string;
  accent_color?: string;
  progress_bar_config?: any;
}

export interface UserRaceTeam {
  team: RaceTeam;
  memberCount: number;
  last_updated_time: Date;
  user_last_viewed_time: Date;
}

export interface UserRaceTeamsAPIResponse {
  race_teams: UserRaceTeam[];
}

export interface FeaturedRaceTeamApiResponse {
  team: RaceTeam;
  memberCount: number;
}

// export interface NewRaceTeamInformation {
//   name?: string;
//   icon?: string;
//   members?: Array<string>;
//   is_featured?: boolean;
//   code?: string;
//   team_image?: string;
//   team_description?: string;
// }
