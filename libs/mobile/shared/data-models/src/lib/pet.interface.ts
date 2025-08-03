import { Activity } from './activity.interface';

export interface Pet {
  id?: string;
  pet_name: string;
  pet_photo_link?: string;
  pet_code?: string;
  pet_total_distance_kms: number;
  pet_total_time_seconds: number;
  pet_total_time: string;
  activities?: Array<Activity>;
  activeDays?: Array<any>;
}

export interface PetOwner {
  id?: string;
  pet_id?: string;
  user_id?: string;
}

export interface PetActivity {
  id?: string;
  pet_id?: string;
  event_result_id?: string;
}
