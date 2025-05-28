import { EventPanel } from "@/components/ui/eventPanel";
import { Button } from "@/components/ui/button";
import { SettingsMenu } from "@/components/settingsMenu";
import { useState } from "react";
import { ThemeProvider } from "@/lib/themeContext";
import { UnitProvider } from "@/lib/unitContext";
import { FontProvider, useFont } from "@/lib/fontContext";

function AppContent() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { useShantellSans } = useFont();

  return (
    <div className={`min-h-screen bg-gradient-to-b from-cream to-mindaro dark:from-ultra_violet-300 dark:to-ultra_violet-100 ${useShantellSans ? 'font-["Shantell_Sans"]' : 'font-["Arial"]'}`}>
      <header className="border-b bg-cream/50 backdrop-blur-sm dark:bg-ultra_violet-400/50 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-ultra_violet dark:text-cream">
            Event Weather Dashboard
          </h1>
          <Button
            variant="ghost"
            className="text-ultra_violet dark:text-cream"
            onClick={() => setSettingsOpen(true)}
          >
            <span className="material-symbols-outlined">settings</span>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <EventPanel />
      </main>
      <SettingsMenu open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UnitProvider>
        <FontProvider>
          <AppContent />
        </FontProvider>
      </UnitProvider>
    </ThemeProvider>
  );
}

export default App;
