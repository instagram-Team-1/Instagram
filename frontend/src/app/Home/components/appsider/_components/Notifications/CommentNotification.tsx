import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type CommentNotificationProps = {
  username: string;
  avatarUrl: string;
  comment: string;
  photoThumbnailUrl: string;
};

export const CommentNotification = ({
  username,
  avatarUrl,
  comment,
  photoThumbnailUrl,
}: CommentNotificationProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{username}</div>
          <p className="text-sm text-muted-foreground">
            commented: <span className="text-foreground">"{comment}"</span>
          </p>
        </div>
      </div>

      <img
        src={photoThumbnailUrl}
        alt="Commented photo"
        className="w-12 h-12 rounded object-cover"
      />
    </div>
  );
};
