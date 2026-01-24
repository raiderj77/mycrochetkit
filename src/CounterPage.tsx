import { useParams } from 'react-router-dom';
import { VoiceCounter } from './components/VoiceCounter';

export function CounterPage() {
  const { projectId } = useParams();
  return <VoiceCounter projectId={projectId || 'default'} />;
}
