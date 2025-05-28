import { EventPanel } from "@/components/ui/eventPanel";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-mindaro dark:from-ultra_violet-300 dark:to-ultra_violet-100">
      <header className="border-b bg-cream/50 backdrop-blur-sm dark:bg-ultra_violet-400/50 py-4">
        <h1 className="container mx-auto px-4 text-2xl font-bold text-ultra_violet dark:text-cream">
          Event Weather Dashboard
        </h1>
      </header>
      
      <main className="container mx-auto p-8">
        <EventPanel />
      </main>
    </div>
  );
}

export default App
