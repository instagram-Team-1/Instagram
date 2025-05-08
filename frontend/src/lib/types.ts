export type UserDataType = {
  _id: string;
  id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  password: string;
  bio: string;
  avatarImage: string;
  followers: string[];
  following: string[];
  posts: string[];
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
};

export type PostType = {
  id: string;
  image: string;
  caption?: string;
  createdAt: string;
  userId: string;
};

export type FollowerType = {
  id: string;
  username: string;
  followers: string[];
};

export interface Story {
  name: string;
  img: string;
  isLive?: boolean;
  timestamp: string;
}
