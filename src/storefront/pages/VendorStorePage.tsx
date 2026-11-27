import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { Alert } from '../../components/ui/Alert';
import { EmptyState } from '../../components/ui/EmptyState';
import { mutedText } from '../../components/ui/styles';
import { usePublicQuery } from '../../hooks/usePublicQuery';
import { Link } from '../../router/Link';
import { navigate } from '../../router/navigation';
import { DIRECTORY_PATH } from '../../services/api/env';
import { storefrontApi } from '../../services/api/storefront';
import { CartBar } from '../components/CartBar';
import { CheckoutSheet } from '../components/CheckoutSheet';
import { StoreHero } from '../components/StoreHero';
import { StoreInfo } from '../components/StoreInfo';
import { StoreLayout } from '../components/StoreLayout';
import { StoreMenu } from '../components/StoreMenu';
import { useCart } from '../hooks/useCart';
import { rememberOrder } from '../utils/recentOrders';

export default function VendorStorePage({ slug }: { slug: string }) {
  const loader = useCallback((signal: AbortSignal) => storefrontApi.vendor(slug, signal), [slug]);
  const query = usePublicQuery(loader);
  const cart = useCart(slug);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const vendor = query.data?.vendor;
  const { reconcile } = cart;

  useEffect(() => {
    if (!vendor) return;
    document.title = `${vendor.businessName} · CHOP`;
    reconcile(vendor.menu);
  }, [vendor, reconcile]);

  if (!vendor) {
    return (
      <StoreLayout>
        {query.loading ? (
          <div className={`py-20 text-center text-[13px] ${mutedText}`}>Loading menu…</div>
        ) : (
          <EmptyState
            icon={UtensilsCrossed}
            title={query.error?.status === 404 ? 'This food spot is not on CHOP' : 'Could not load this page'}
            action={
              <Link to={DIRECTORY_PATH} className="text-[13px] font-semibold text-[#E8772E] hover:underline">
                See all food spots
              </Link>
            }
          >
            {query.error?.message}
          </EmptyState>
        )}
      </StoreLayout>
    );
  }

  const showCart = vendor.canOrder && cart.count > 0;

  return (
    <StoreLayout>
      <div className={`space-y-4 ${showCart ? 'pb-24' : ''}`}>
        <Link to={DIRECTORY_PATH} className={`inline-flex items-center gap-1 text-[13px] font-semibold hover:text-[#E8772E] ${mutedText}`}>
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All food spots
        </Link>
        <StoreHero vendor={vendor} />
        {!vendor.canOrder && (
          <Alert tone="info">
            {vendor.businessName} is not taking orders on CHOP right now. You can still browse the menu or message them on WhatsApp.
          </Alert>
        )}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
          <StoreMenu sections={vendor.menu} canOrder={vendor.canOrder} quantityOf={cart.quantityOf} onChange={cart.setQuantity} />
          <StoreInfo vendor={vendor} />
        </div>
      </div>

      {showCart && <CartBar count={cart.count} subtotal={cart.subtotal} onOpen={() => setCheckoutOpen(true)} />}

      {checkoutOpen && (
        <CheckoutSheet
          vendor={vendor}
          lines={cart.lines}
          subtotal={cart.subtotal}
          onQuantity={(line, quantity) => cart.setQuantity({ id: line.itemId, name: line.name, price: line.price }, quantity)}
          onClose={() => setCheckoutOpen(false)}
          onPlaced={(orderId) => {
            cart.clear();
            rememberOrder(orderId);
            navigate(`/order/${orderId}`);
          }}
          onMenuChanged={query.reload}
        />
      )}
    </StoreLayout>
  );
}
