import { AccountBookOutlined, TeamOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import { useState } from 'react';
import CompareDemo from './CompareDemo';
import G2PlotTypeDemo from './G2PlotTypeDemo';
import style from './index.less';

const SettlementProductView: React.FC = () => {
  const [tabKey, setTabKey] = useState<string>('product');

  const renderTab = () => {
    switch (tabKey) {
      case 'product':
        return <CompareDemo />;
      case 'manager':
        return <G2PlotTypeDemo />;
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
                  对比
                </div>
              ),
              key: 'product',
            },
            {
              label: (
                <div>
                  <TeamOutlined style={{ marginRight: 4 }} />
                  类型
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
