import { useEffect, useMemo, useState } from 'react';
import { Eye, FlaskConical, Send } from 'lucide-react';
import { adminApi } from '../../services/api/admin';
import { useTokenQuery } from '../../hooks/useTokenQuery';
import { useAuthorizedAction } from '../../hooks/useAuthorizedAction';
import type { Audience, AudienceKind, NewsletterContent, PreviewResult, Subscriber } from '../types';
import { plural } from '../utils/format';
import { countRecipients } from '../utils/subscribers';
import { AudiencePicker } from './AudiencePicker';
import { NewsletterHistory } from './NewsletterHistory';
import { NewsletterPreview } from './NewsletterPreview';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { fieldClass, labelClass, mutedText } from '../../components/ui/styles';

interface NewsletterViewProps {
  token: string;
  subscribers: Subscriber[];
  selected: Set<string>;
  audienceKind: AudienceKind;
  onAudienceKindChange: (kind: AudienceKind) => void;
  historyVersion: number;
  onUnauthorized: () => void;
}

function toAudience(kind: AudienceKind, selected: Set<string>): Audience {
  return kind === 'selected' ? { kind, ids: [...selected] } : { kind };
}

export function NewsletterView({
  token,
  subscribers,
  selected,
  audienceKind,
  onAudienceKindChange,
  historyVersion,
  onUnauthorized,
}: NewsletterViewProps) {
  const [content, setContent] = useState<NewsletterContent>({ subject: '', message: '' });
  const [testEmail, setTestEmail] = useState('');
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const action = useAuthorizedAction(onUnauthorized);
  const history = useTokenQuery(token, adminApi.newsletters, onUnauthorized);
  const reloadHistory = history.reload;

  useEffect(() => {
    if (historyVersion > 0) reloadHistory();
  }, [historyVersion, reloadHistory]);

  const audience = useMemo(() => toAudience(audienceKind, selected), [audienceKind, selected]);
  const recipients = useMemo(() => countRecipients(subscribers, audience), [subscribers, audience]);
  const ready = content.subject.trim() !== '' && content.message.trim() !== '';

  const update = (patch: Partial<NewsletterContent>) => {
    setContent((current) => ({ ...current, ...patch }));
    setNotice(null);
  };

  const handlePreview = async () => {
    const result = await action.run(() => adminApi.preview(token, content));
    if (result) setPreview(result);
  };

  const handleTest = async () => {
    const result = await action.run(() => adminApi.sendTest(token, content, testEmail.trim()));
    if (result) setNotice(`Test sent to ${result.to}.`);
  };

  const handleSend = async () => {
    if (!window.confirm(`Send "${content.subject}" to ${plural(recipients, 'person')}? This cannot be undone.`)) return;
    const result = await action.run(() => adminApi.send(token, content, audience));
    if (!result) return;
    const { delivered, failed } = result.newsletter;
    setNotice(failed > 0 ? `Sent to ${delivered}. ${failed} failed, check the logs.` : `Sent to ${plural(delivered, 'person')}.`);
    setContent({ subject: '', message: '' });
    setPreview(null);
    history.reload();
  };

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] [&>*]:min-w-0">
      <Card title="Compose newsletter">
        <div className="space-y-3">
          <AudiencePicker
            value={audienceKind}
            onChange={onAudienceKindChange}
            selectedCount={selected.size}
            recipientCount={recipients}
          />
          <div>
            <label htmlFor="newsletter-subject" className={labelClass}>
              Subject
            </label>
            <input
              id="newsletter-subject"
              maxLength={150}
              value={content.subject}
              onChange={(event) => update({ subject: event.target.value })}
              placeholder="CHOP is live in Ijebu Ode"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="newsletter-message" className={labelClass}>
              Message
            </label>
            <textarea
              id="newsletter-message"
              rows={10}
              maxLength={20000}
              value={content.message}
              onChange={(event) => update({ message: event.target.value })}
              placeholder={'Hi {{name}},\n\nWe have news…'}
              className={`${fieldClass} resize-y leading-relaxed`}
            />
            <div className={`mt-1 text-[12px] ${mutedText}`}>
              Use {'{{name}}'} for the first name. Leave a blank line between paragraphs. Links become clickable.
            </div>
          </div>

          {action.error && <Alert tone="error">{action.error}</Alert>}
          {notice && <Alert tone="success">{notice}</Alert>}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              variant="secondary"
              disabled={!ready}
              loading={action.pending}
              icon={<Eye className="w-3.5 h-3.5" aria-hidden="true" />}
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              disabled={!ready || recipients === 0}
              loading={action.pending}
              icon={<Send className="w-3.5 h-3.5" aria-hidden="true" />}
              onClick={handleSend}
            >
              Send to {recipients.toLocaleString()}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#0E0D0B]/[0.06] dark:border-white/[0.05]">
            <input
              type="email"
              aria-label="Test email address"
              placeholder="you@example.com"
              value={testEmail}
              onChange={(event) => setTestEmail(event.target.value)}
              className={`${fieldClass} flex-1 min-w-0 basis-[180px]`}
            />
            <Button
              variant="secondary"
              disabled={!ready || !testEmail.includes('@')}
              loading={action.pending}
              icon={<FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />}
              onClick={handleTest}
            >
              Send test
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Card title="Preview">
          <NewsletterPreview preview={preview} />
        </Card>
        <Card title="Sent newsletters">
          <NewsletterHistory
            entries={history.data?.newsletters ?? []}
            loading={history.loading}
            error={history.error}
          />
        </Card>
      </div>
    </div>
  );
}
