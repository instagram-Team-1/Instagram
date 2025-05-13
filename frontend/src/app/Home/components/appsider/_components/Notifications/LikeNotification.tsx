import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

type LikeNotificationProps = {
  username: string;
  avatarUrl: string;
  photoThumbnailUrl: string;
};

export const LikeNotification = ({ username, avatarUrl, photoThumbnailUrl }: LikeNotificationProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      {/* Avatar and Text */}
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{username}</div>
          <p className="text-sm text-muted-foreground">liked your photo</p>
        </div>
      </div>

      <Image
        src={photoThumbnailUrl}
        width={50}
        height={50}
        alt="Liked photo"
        className="w-12 h-12 rounded object-cover"
      />
    </div>
  );
};
