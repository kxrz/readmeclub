export type ResourceType = 
  | 'language_file' 
  | 'plugin' 
  | 'link' 
  | 'documentation' 
  | 'tool' 
  | 'font'
  | 'wallpaper'
  | 'info' 
  | 'other';

export type ResourceStatus = 'pending' | 'approved' | 'flagged' | 'removed';

export type WallpaperCategory = 
  | 'minimalist' 
  | 'dark' 
  | 'light' 
  | 'pop_culture' 
  | 'custom' 
  | 'other';

export type WallpaperStatus = 'draft' | 'published';

export type FeatureRequestStatus = 'published' | 'draft' | 'archived';
export type AdminStatus = 'pending' | 'planned' | 'completed' | 'rejected';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  version?: string;
  compatibility?: string;
  installation_instructions?: string;
  known_issues?: string;
  file_url?: string;
  file_name?: string;
  external_link?: string;
  thumbnail_url?: string;
  contributor_name?: string;
  contact_info?: string;
  status: ResourceStatus;
  hidden: boolean;
  starred: boolean;
  downloads_count: number;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Wallpaper {
  id: string;
  status: WallpaperStatus;
  title?: string;
  category?: WallpaperCategory;
  author_name?: string;
  reddit_username?: string;
  instagram_username?: string;
  file_url: string;
  file_name: string;
  file_size: number;
  width: number;
  height: number;
  download_count: number;
  flags_count: number;
  hidden: boolean;
  submitted_ip_hash: string;
  created_at: string;
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  reddit_username?: string;
  tags: string[];
  votes_count: number;
  warnings_count: number;
  status: FeatureRequestStatus;
  hidden: boolean;
  admin_status: AdminStatus;
  created_at: string;
  updated_at: string;
}

export interface LocationDeclaration {
  id: string;
  country_code: string;
  created_at: string;
}

export interface FeatureVote {
  id: string;
  feature_request_id: string;
  ip_hash: string;
  created_at: string;
}

export interface SubmissionLimit {
  id: string;
  ip_hash: string;
  submission_count: number;
  last_submission_at?: string;
  reset_at: string;
}

export interface Analytics {
  id: string;
  pdf_downloads: number;
  pdf_v2_downloads: number;
  epub_v2_downloads: number;
  csv_downloads: number;
  page_views: number;
  last_updated: string;
}

