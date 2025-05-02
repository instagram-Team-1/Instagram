export type UserDataType = {
  id: string;
  username: String;
  fullname: String;
  email: String;
  phone: String;
  password: String;
  bio: String;
  avatarImage: String;
  followers: string[];
  following: string[];
  posts: string[];
  createdAt: Date;
  updateAt: Date;
};

export type PostType = {
  id: string;
  image: string;
  caption?: string;
  createdAt: string;
  userId: string;
};

export type Story = {
  _id: string;
  mediaUrl: string;
  type: "image" | "video";
  userId: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
};
