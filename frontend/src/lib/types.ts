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
