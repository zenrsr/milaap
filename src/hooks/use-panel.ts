import { useProfileMemberId } from "@/features/members/store/use-profile-member-id";
import { useParentMessageId } from "@/features/messages/store/use-parent-message";

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId() as [
    string | null,
    (id: string | null) => void,
  ];
  const [profileMemberId, setProfileMemberId] = useProfileMemberId() as [
    string | null,
    (id: string | null) => void,
  ];

  const onOpenProfile = (memberId: string): void => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onOpenMessage = (messageId: string): void => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };

  const onCloseMessage = (): void => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    profileMemberId,
    onOpenProfile,
    onOpenMessage,
    onCloseMessage,
  };
};
