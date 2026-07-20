import { PRODUCT_BLOCKS } from '../collections/registry';
import { CollectionsList } from './collectionsList';

export const meta = {
  id: 'blocks',
  label: 'Building Blocks',
  description: 'Real-world product blocks composed from the themed components — copy-ready patterns.',
};

export function Section() {
  return <CollectionsList items={PRODUCT_BLOCKS} />;
}
