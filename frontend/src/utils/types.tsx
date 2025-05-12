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


// src/lib/types.ts

export interface Post {
  _id: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  avatarImage?: string;
  posts: Post[];
  followers: number | any[];
  following: number | any[];
}

export interface Comment {
  comment: string;
  user: {
    username: string;
  };
}

export interface PostCardProps {
  imageUrl: string;
  caption: string;
  userId: User;
  likes: number;
  postId: string;
  currentUserId: string;
  currentUserUsername: string;
}

export interface UserDataType {
  id: string;
  username: string;
  email: string;
}

