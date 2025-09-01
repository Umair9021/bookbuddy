import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from "@/components/ui/button";
import { UserCircle, User, LogOut , Flag, Mail} from 'lucide-react';
import getImageSrc from '@/utils/getImageSrc';

const UserDropdown = ({
  userDropdownOpen,
  setUserDropdownOpen,
  avatarUrl,
  user,
  router,
  handleSignOut
}) => {
  return (
    <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 md:w-8 md:h-8 rounded-full overflow-hidden">
            {avatarUrl != null ? (
              <img
                className="w-full h-full object-cover"
                src={getImageSrc(avatarUrl)}
                alt="User Profile"
              />
            ) : (
              <UserCircle className="w-full h-full object-cover" />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 mt-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('Profile')}>
          <User className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center space-x-2 text-red-600 cursor-pointer" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;