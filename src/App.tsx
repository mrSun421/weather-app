import { EventPanel } from "@/components/ui/eventPanel";
import { Button } from "@/components/ui/button";
import { SettingsMenu } from "@/components/settingsMenu";
import { useState } from "react";
import { ThemeProvider } from "@/lib/themeContext";

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-cream to-mindaro dark:from-ultra_violet-300 dark:to-ultra_violet-100">
        <header className="border-b bg-cream/50 backdrop-blur-sm dark:bg-ultra_violet-400/50 py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-ultra_violet dark:text-cream">
              Event Weather Dashboard
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-ultra_violet dark:text-cream hover:bg-ultra_violet/10 dark:hover:bg-cream/10"
              aria-label="Settings"
              onClick={() => setSettingsOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Button>
          </div>
        </header>
        
        <main className="container mx-auto p-8">
          <EventPanel />
        </main>

        <SettingsMenu open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </ThemeProvider>
  );
}

export default App
