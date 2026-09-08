import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import SavedScripts from "@/pages/SavedScripts";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { SavedScriptsProvider } from "./contexts/SavedScriptsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from './pages/Home';
import BOF from './pages/BOF';
import VetProduct from './pages/VetProduct';
import VideoLab from './pages/VideoLab';
import CommandCenter from './pages/CommandCenter';
import AutoReports from './pages/AutoReports';
import VideoEditor from './pages/VideoEditor';

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/saved"} component={SavedScripts} />
      <Route path={"/bof"} component={BOF} />
      <Route path={"/vet"} component={VetProduct} />
      <Route path={"/videolab"} component={VideoLab} />
      <Route path={"/editor"} component={VideoEditor} />
      <Route path={"/command"} component={CommandCenter} />
      <Route path={"/autoreports"} component={AutoReports} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <SavedScriptsProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SavedScriptsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
