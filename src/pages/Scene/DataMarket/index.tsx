import CodeBlockView from './components/codeBlockView';

const DataMarketView: React.FC = () => {
  return (
    <>
      <CodeBlockView
        content={`import { GetSql } from '@/services/eam-api/datacenter/datahub';
import { transform2Objects } from '@/services/eam-api/datamarket/transfer_data';  
`}
        lang={'typescript'}
      />
    </>
  );
};

export default DataMarketView;
