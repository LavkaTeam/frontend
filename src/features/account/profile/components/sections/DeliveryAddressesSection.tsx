import { Button } from '@/components/ui/Button';
import { EditProductIcon } from '@/components/ui/icons/EditProductIcon';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';

import type { UserAddress } from '../../types/profileForm.types';
import styles from './ProfileFormSections.module.css';

interface DeliveryAddressesSectionProps {
  addresses: UserAddress[];
  onAddAddress: () => void;
  onEditAddress: (address: UserAddress) => void;
  onDeleteAddress: (address: UserAddress) => void;
}

const DeliveryAddressesSection = ({
  addresses,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}: DeliveryAddressesSectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeaderCompact}>
        <div>
          <h3 className={styles.sectionTitle}>Delivery Addresses</h3>
        </div>
        <Button className={styles.addAddressButton} onClick={onAddAddress}>
          Add address
        </Button>
      </div>

      <div className={styles.addressList}>
        {addresses.length === 0 ? (
          <div className={styles.emptyState}>
            No delivery addresses saved yet. Add the first address so orders
            can be delivered to the correct location.
          </div>
        ) : (
          addresses.map((address) => (
            <article key={address.id} className={styles.addressCard}>
              <div className={styles.addressCardHeader}>
                <div>
                  <div className={styles.addressCardTitle}>
                    {address.title || 'Delivery address'}
                  </div>
                  <div className={styles.addressCardMeta}>
                    {[address.country, address.city, address.street]
                      .filter(Boolean)
                      .join(', ')}
                    {address.zipCode ? `, ${address.zipCode}` : ''}
                  </div>
                  {(address.recipientName || address.recipientPhone) && (
                    <div className={styles.addressCardMeta}>
                      {[address.recipientName, address.recipientPhone]
                        .filter(Boolean)
                        .join(' • ')}
                    </div>
                  )}
                  {address.deliveryNotes && (
                    <div className={styles.addressCardMeta}>
                      {address.deliveryNotes}
                    </div>
                  )}
                </div>

                <div className={styles.addressCardActions}>
                  <button
                    type='button'
                    className={styles.iconActionButton}
                    onClick={() => onEditAddress(address)}
                    aria-label='Edit address'
                  >
                    <EditProductIcon
                      width={20}
                      height={20}
                      color='currentColor'
                    />
                  </button>
                  <button
                    type='button'
                    className={`${styles.iconActionButton} ${styles.deleteActionButton}`}
                    onClick={() => onDeleteAddress(address)}
                    aria-label='Delete address'
                  >
                    <TrashIcon width='20' height='20' color='currentColor' />
                  </button>
                </div>
              </div>

              <div className={styles.addressDivider} />
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export { DeliveryAddressesSection };
