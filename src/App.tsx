import { useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import TabBar from './components/TabBar';
import { useSettingsStore } from './stores/settingsStore';
import Home from './features/home/Home';
import SceneSelect from './features/train/SceneSelect';
import DurationSelect from './features/train/DurationSelect';
import TrainRun from './features/train/TrainRun';
import ReactionPage from './features/reaction/ReactionPage';
import AudioPage from './features/audio/AudioPage';
import DataPage from './features/data/DataPage';
import Profile from './features/profile/Profile';
import CueManage from './features/profile/CueManage';
import Feedback from './features/profile/Feedback';
import SettingsPage from './features/profile/SettingsPage';
import PowerChainPage from './features/powerchain/PowerChainPage';
import AnticipationPage from './features/anticipation/AnticipationPage';
import OcclusionPage from './features/anticipation/OcclusionPage';
import MentalRehearsalPage from './features/anticipation/MentalRehearsalPage';
import IntegrationPage from './features/integration/IntegrationPage';

function Layout() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md bg-slate-50 pb-16 dark:bg-slate-950">
      <Outlet />
      <TabBar />
    </div>
  );
}

function ThemeApplier() {
  const theme = useSettingsStore((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    const apply = (dark: boolean) => root.classList.toggle('dark', dark);
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mq.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    apply(theme === 'dark');
  }, [theme]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ThemeApplier />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/train" element={<SceneSelect />} />
          <Route path="/train/duration" element={<DurationSelect />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/cue" element={<CueManage />} />
          <Route path="/profile/feedback" element={<Feedback />} />
          <Route path="/profile/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/train/run" element={<TrainRun />} />
        <Route path="/reaction" element={<ReactionPage />} />
        <Route path="/audio" element={<AudioPage />} />
        <Route path="/powerchain" element={<PowerChainPage />} />
        <Route path="/anticipation" element={<AnticipationPage />} />
        <Route path="/occlusion" element={<OcclusionPage />} />
        <Route path="/mental" element={<MentalRehearsalPage />} />
        <Route path="/integration" element={<IntegrationPage />} />
      </Routes>
    </HashRouter>
  );
}
