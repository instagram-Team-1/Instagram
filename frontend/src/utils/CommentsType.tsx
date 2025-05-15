export interface Comment {
  _id: string;
  comment: string;
  user: {
    _id: string;
    username: string;
    avatarImage: string;
  };
}

export interface CommentModalProps {
  imageUrl: string;
  user: { username: string; avatarImage?: string };
  caption: string;
  likesCount: number;
  liked: boolean;
  onLike: () => void;
  onShare: () => void;
  comment: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  comments: Comment[];
  currentUserUsername: string;
  currentUserAvatarImage: string;
}