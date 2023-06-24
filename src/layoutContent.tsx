import { ConfigProvider, theme } from 'antd';

type LayoutContentViewProps = {
  children: React.ReactNode;
};

export const LayoutContentView: React.FC<LayoutContentViewProps> = (props) => {
  const { children } = props;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};
