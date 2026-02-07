import { useParams, Navigate } from 'react-router-dom';
import { VoiceCounter } from './components/VoiceCounter';

export function CounterPage() {
  const { projectId } = useParams();
  if (!projectId) return <Navigate to="/" replace />;
  return <VoiceCounter projectId={projectId} />;
}
