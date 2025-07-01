import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { profileStore } from "@/lib/stores";
import { getFullName, logout } from "@/lib/utils";
import { DotsVerticalIcon, GearIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { LogOutIcon, UserCircle } from "lucide-react";
import { useTranslations } from "use-intl";
import { useConfirm } from "./ui/alert-dialog-provider";

export function NavUser() {
  const { isMobile } = useSidebar();
  const profile = useStore(profileStore);
  const t = useTranslations();

  const fullName = getFullName(
    profile.firstName,
    profile.lastName,
    profile.nameOrder,
  );
  const confirm = useConfirm();
  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={profile.avatar} alt={fullName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{fullName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {profile.email}
                </span>
              </div>
              <DotsVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={profile.avatar} alt={fullName} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{fullName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {profile.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GearIcon />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                const confirmed = await confirm({
                  title: t("are-you-sure"),
                  body: t("logout-message"),
                  cancelButton: t("cancel"),
                  cancelButtonVariant: "secondary",
                  actionButton: t("confirm"),
                  actionButtonVariant: "destructive",
                });

                if (confirmed) {
                  await logout();
                  navigate({ to: "/" });
                }
              }}
            >
              <LogOutIcon />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
