import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type FollowNotificationProps = {
  username: string;
  avatarImage: string;
  isFollowing: boolean;
};

export const FollowNotification = ({ username, avatarImage, isFollowing }: FollowNotificationProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarImage} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{username}</div>
          <p className="text-sm text-muted-foreground">started following you</p>
        </div>
      </div>
      <Button variant={isFollowing ? 'outline' : 'default'}>
        {isFollowing ? 'Following' : 'Follow back'}
      </Button>
    </div>
  );
};

