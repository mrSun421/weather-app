import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ShareButtonsProps {
  title: string;
  text: string;
  url?: string;
}

export function ShareButtons({ title, text, url = window.location.href }: ShareButtonsProps) {
  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (typeof navigator === 'undefined' || !('share' in navigator)) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-steel_blue dark:text-mindaro hover:text-ultra_violet dark:hover:text-cream"
            onClick={handleShare}
          >
            <span className="material-symbols-outlined">share</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share</TooltipContent>
      </Tooltip>
    </div>
  );
} 