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
  storyGroup?: string[];
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

export type PostCardProps = {
  imageUrl: string;
  caption: string;
  userId: {
    posts: never[];
    followers: number;
    following: number;
    _id: string;
    username: string;
    avatarImage: string;
  };
  likes: number;
  comments: {
    userId: string;
    comment: string;
    createdAt: string;
    _id: string;
  }[];
  postId: string;
  currentUserId: string;
  currentUserUsername: string;
};

export type Post = {
  imageUrl: string;
  _id: string;
  image: string;
  caption: string;
  userId: {
    _id: string;
    username: string;
    avatarImage: string;
  };
  likes: number | string;
  comments: {
    userId: string;
    comment: string;
    createdAt: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

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

export type HighlightType = {
  [x: string]: string;
  id: string;
  title: string;
  stories: {
    [x: string]: string | undefined;
    _id: string;
    imageUrl: string;
  }[];
};

export type StoryType = {
  _id: string;
  title: string;
  imageUrl: string; // 👈 image биш
  createdAt?: string;
  // бусад property
};
