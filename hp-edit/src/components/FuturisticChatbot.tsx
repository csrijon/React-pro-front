"use client";

import AiAvatarCompanion from "./AiAvatarCompanion";
import { OrganizationData } from "@/types";

interface FuturisticChatbotProps {
  organization: OrganizationData | null;
}

export default function FuturisticChatbot({ organization }: FuturisticChatbotProps) {
  return <AiAvatarCompanion organization={organization} />;
}
