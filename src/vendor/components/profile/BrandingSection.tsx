import { Alert } from '../../../components/ui/Alert';
import { Card } from '../../../components/ui/Card';
import { useAuthorizedAction } from '../../../hooks/useAuthorizedAction';
import { vendorApi } from '../../../services/api/vendor';
import { useProfileSaver } from '../../hooks/useProfileSaver';
import type { UploadKind, VendorProfile } from '../../types';
import { useVendor } from '../../VendorContext';
import { ImagePicker } from '../shared/ImagePicker';

export function BrandingSection({ vendor }: { vendor: VendorProfile }) {
  const { token, logout, applyProfile } = useVendor();
  const action = useAuthorizedAction(logout);
  const saver = useProfileSaver();

  const upload = (kind: Exclude<UploadKind, 'item'>) => async (file: Blob) => {
    const result = await action.run(() => vendorApi.upload(token, kind, file));
    if (!result?.vendor || !result.checklist) return false;
    applyProfile({ vendor: result.vendor, checklist: result.checklist, readyToPublish: Boolean(result.readyToPublish) });
    return true;
  };

  const error = action.error ?? saver.error;

  return (
    <Card title="Photos">
      <div className="space-y-4">
        <ImagePicker
          label="Cover photo"
          shape="wide"
          maxSide={1600}
          value={vendor.coverUrl}
          hint="A wide photo of your food or shop. Shown at the top of your page."
          onUpload={upload('cover')}
          onRemove={() => void saver.save({ coverUrl: null })}
        />
        <ImagePicker
          label="Logo"
          shape="round"
          maxSide={600}
          value={vendor.logoUrl}
          hint="Square works best."
          onUpload={upload('logo')}
          onRemove={() => void saver.save({ logoUrl: null })}
        />
        {error && <Alert tone="error">{error}</Alert>}
      </div>
    </Card>
  );
}
