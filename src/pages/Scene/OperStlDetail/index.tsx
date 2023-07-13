import { AccountBookOutlined, TeamOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useState } from 'react';
import CompareDemo from './CompareDemo';
import style from './index.less';

const SettlementProductView: React.FC = () => {
  const [tabKey, setTabKey] = useState<string>('product');

  const renderTab = () => {
    switch (tabKey) {
      case 'product':
        return <CompareDemo />;
      case 'manager':
        return 'yyy';
      default:
        return null;
    }
  };

  return (
    <PageContainer
      className={style.pageContainer}
      fixedHeader={false}
      subTitle={
        <Tabs
          className={style.pcTabs}
          style={{ margin: '0' }}
          activeKey={tabKey}
          // size="small"
          items={[
            {
              label: (
                <div>
                  <AccountBookOutlined style={{ marginRight: 4 }} />
                  G2Plot
                </div>
              ),
              key: 'product',
            },
            {
              label: (
                <div>
                  <TeamOutlined style={{ marginRight: 4 }} />
                  ECharts
                </div>
              ),
              key: 'manager',
            },
          ]}
          onChange={(activeKey) => {
            setTabKey(activeKey);
          }}
        />
      }
    >
      {renderTab()}
    </PageContainer>
  );
};

export default SettlementProductView;
