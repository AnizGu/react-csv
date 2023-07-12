import React from 'react';
import { CSVDownload, CSVImport } from '../lib';
import styled from 'styled-components';
import './App.css';

const FlexLayout = styled.div`
  display: flex;
  gap: 8px;
`;

function App() {
  return (
    <FlexLayout>
      <CSVDownload
        disabled
        wrapper='span'
        // datas={`id,name\n1, 张老三\n2, 李老四`}
        // datas="https://www.baidu.com"
        // datas="姓\n顾"
        columns={['CONTENT TYPE', 'TITLE']}
        // datas={datas}
        // datas={['姓','名']}
        // datas="https://hcmall-oss.oss-cn-shenzhen.aliyuncs.com/headers/3afeab10-95ae-11ed-8bbb-e14d6647ff75"
        // datas={[{ id: 1, name: "张老三" }, { id: 2, name: '李老四' }]}
        onChange={async (datas) => {
          console.log("CSVDownload-onChange", datas);
          return datas;
        }}
        datas="https://www.papaparse.com/resources/files/normal.csv"
        filename='test'
      >
        <button>Download CSV</button>
      </CSVDownload>
      <CSVImport
        onChange={async (datas) => {
          console.log("CSVImport-onChange", datas);
          return datas;
        }}
      >
        <button>Import CSV</button>
      </CSVImport>
    </FlexLayout>
  )
}

export default App
