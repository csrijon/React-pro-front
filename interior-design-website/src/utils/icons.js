import { Home, Building2, LayoutGrid, Armchair, Lamp, MessageCircle, Sparkles, DraftingCompass } from 'lucide-react';

export const SERVICE_ICONS = { Home, Building2, LayoutGrid, Armchair, Lamp, MessageCircle, Sparkles, DraftingCompass };
export const getServiceIcon = (name) => SERVICE_ICONS[name] || Sparkles;
