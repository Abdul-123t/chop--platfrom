import { useEffect, useState } from 'react';
import { CheckCircle2, MailX } from 'lucide-react';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Wordmark } from '../components/ui/Wordmark';
import { cardClass, mutedText } from '../components/ui/styles';
import { useTheme } from '../hooks/useTheme';
import { unsubscribe } from '../services/api/unsubscribe';

type Status = 'idle' | 'pending' | 'done' | 'error';

export default function UnsubscribePage() {
  useTheme();
  const token = new URLSearchParams(window.location.search).get('token') ?? '';
  const [status, setStatus] = useState<Status>(token ? 'idle' : 'error');
  const [error, setError] = useState(token ? '' : 'This unsubscribe link is incomplete.');

  useEffect(() => {
    document.title = 'Unsubscribe | CHOP';
  }, []);

  const confirm = async () => {
    setStatus('pending');
    try {
      await unsubscribe(token);
      setStatus('done');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not unsubscribe. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F7F1E8] dark:bg-[#0E0D0B] text-[#0E0D0B] dark:text-[#F7F1E8]">
      <div className={`${cardClass} w-full max-w-sm p-6 space-y-4 text-center`}>
        <div className="flex justify-center">
          <a href="/" aria-label="CHOP home">
            <Wordmark />
          </a>
        </div>
        {status === 'done' ? (
          <>
            <CheckCircle2 className="w-10 h-10 mx-auto text-[#3FA66B]" aria-hidden="true" />
            <h1 className="text-xl font-extrabold">You're unsubscribed</h1>
            <div className={`text-[14px] ${mutedText}`}>
              You won't get CHOP newsletters anymore. You're still on the waitlist.
            </div>
          </>
        ) : (
          <>
            <MailX className="w-10 h-10 mx-auto text-[#E8772E]" aria-hidden="true" />
            <h1 className="text-xl font-extrabold">Unsubscribe from CHOP emails?</h1>
            <div className={`text-[14px] ${mutedText}`}>You'll stop receiving newsletters from us.</div>
            {status === 'error' && <Alert tone="error">{error}</Alert>}
            {token && (
              <Button onClick={confirm} loading={status === 'pending'} className="w-full py-2.5">
                Unsubscribe
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
