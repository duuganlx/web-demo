import { Col, Row } from 'antd';
import ProductSearch from './components/productSearch';

const SettleDetailByProduct: React.FC = () => {
  return (
    <>
      <Row gutter={24} wrap={false}>
        <Col flex="340px">
          <ProductSearch />
        </Col>
        <Col flex="auto"></Col>
      </Row>
    </>
  );
};

export default SettleDetailByProduct;
