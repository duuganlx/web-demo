import {
  ListStlProducts,
  StlAccountItem,
  StlProductItem,
  StlUnitItem,
} from '@/services/eam-api/operation/settlement';
import { useEffect } from 'react';

interface ProductSearchProps {
  onProductSelected?: (
    item: StlAccountItem | StlUnitItem | StlProductItem,
    // itemType: 'account' | 'unit' | 'product',
    product: StlProductItem,
  ) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = (props) => {
  console.log(props);

  useEffect(() => {
    ListStlProducts().then((res) => {
      console.log(res);
    });
  }, []);

  return 'xxx';
};

export default ProductSearch;
