import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/screens/Dashboard";
import { AddExpense } from "./components/screens/AddExpense";
import { Insights } from "./components/screens/Insights";
import { CaptainsLog } from "./components/screens/CaptainsLog";
import { TreasureVault } from "./components/screens/TreasureVault";
import { Profile } from "./components/screens/Profile";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Sidebar />
          <main className="min-h-screen pt-12 md:ml-[280px] md:pt-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddExpense />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/ai" element={<CaptainsLog />} />
              <Route path="/vault" element={<TreasureVault />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Toaster position="top-center" />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
