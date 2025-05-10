// components/stories/types.ts
export type UserInfo = {
  _id: string;
  username: string;
  avatarImage: string;
};

export type StoryItem = {
  _id: string;
  imageUrl: string;
  createdAt?: string;
  expiresAt?: string;
  viewed?: boolean;
};

export type GroupedStory = {
  user: UserInfo;
  stories: StoryItem[];
};
