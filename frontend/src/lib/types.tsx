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

export interface PostCardProps {
  postId: string;
  imageUrl: string;
  caption: string;
  user: {
    _id: string;
    username: string;
    avatarImage: string;
  };
  likes: {
    _id: string;
    username: string;
    avatarImage: string;
  }[];
  comments: {
    _id: string;
    comment: string;
    userId: {
      _id: string;
      username: string;
      avatarImage: string;
    };
  }[];
  comment?: string;
  isLiked: boolean;
  isSaved: boolean;
  currentUserId: string;
  currentUserUsername: string;
  currentUserAvatarImage: string;
}

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
  avatarImage: string;
  username: string;
  _id: string;
}

export interface Comment {
  comment: string;
  user: {
    username: string;
  };
}

export type HighlightType = {
  [x: string]: any; // эсвэл string, unknown гэх мэт
  id: string;
  title: string;
  stories: {
    _id: string;
    imageUrl: string;
  }[];
};

export type StoryType = {
  _id: string;
  imageUrl: string;
  title?: string;
  createdAt?: string;
};

export type GroupedStory = {
  _id?: string;
  user: { _id: string; username: string; avatarImage: string };
  stories: { _id: string; imageUrl: string; createdAt?: string }[];
};
