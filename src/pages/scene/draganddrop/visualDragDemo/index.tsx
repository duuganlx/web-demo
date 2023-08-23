import { PageContainer } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useState } from 'react';
import EditorModeView from './components/editorMode';
import ShowModeView from './components/showMode';

// 目前存在问题：
// 1. 画布宽高没有自适应
const CardMarketView: React.FC = () => {
  const [isEditState, setIsEditState] = useState<boolean>(false);

  return (
    <PageContainer
      fixedHeader={false}
      subTitle={
        <>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setIsEditState(!isEditState);
            }}
          >
            {isEditState ? '保存' : '编辑'}
          </Button>
        </>
      }
    >
      {isEditState ? <EditorModeView /> : <ShowModeView />}
    </PageContainer>
  );
};

export default CardMarketView;
