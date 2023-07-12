# React CSV

> 下载和导入 CSV 组件

[![NPM](https://img.shields.io/npm/v/@gulibs/react-csv.svg)](https://www.npmjs.com/package/react-csv)

[toc]

## 安装

```bash
npm install --save @gulibs/react-csv
```

**or**

```bash
yarn add @gulibs/react-csv
```

## 使用

App.css

```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
```

下载网络 CSV 文件

```javascript
import { CSVDownload } from '@gulibs/react-csv';
import './App.css';

const App: React.FC = () => {
    return (
        <CSVDownload
            wrapper='span'
            // 字符串示例
            // datas={`firstname,lastname\nJohn, Doe`}
            // datas="firstname,lastname\nJohn,Doe"
            // URL示例
            // datas={new URL('https://www.papaparse.com/resources/files/normal.csv')}
            // 对象数组
            // datas={[{firstname: 'John', lastname: 'Doe'}, {firstname: 'Alice', lastname: 'Smith'}]}
            columns={['CONTENT TYPE', 'TITLE']}
            onChange={async (datas) => {
                console.log("CSVDownload-onChange", datas);
                return datas;
            }}
            datas="https://www.papaparse.com/resources/files/normal.csv"
            filename='test'
        >
            <button>Download CSV</button>
        </CSVDownload>
    )
}

export default App
```

导入本地 CSV 文件

```javascript
import { CSVImport } from '@gulibs/react-csv';
import './App.css';

const App: React.FC = () => {
    return (
        <CSVImport
            onChange={async (datas) => {
                console.log("CSVImport-onChange", datas);
                return datas;
            }}
        >
            <button>Import CSV</button>
        </CSVImport>
    )
}

export default App;
```

## API

### CSVDownload

用于将 CSV 数据转换为 CSV 文件并下载。

| 属性 | 是否必传 |类型| 说明  | 默认值 |
| ---- | -------- | --------- | --------- | --------- |
| `style` | `否` | `CSSProperties` | 组件样式 | |
| `className` | `否` | `string` | 组件类名 | |
| `datas` | `是` | `string` or `URL` or `CSVData` | 数据源 ||
| `columns` | `否` | `string[]` | 输出列，当需要保留某几列数据展示时可以使用 |`[]`|
| `disabled` | `否` | `boolean` |  是否屏蔽组件 | `undefined` |
| `wrapper` | `否` | `boolean` |  包装元素 | `div` |
| `filename` | `否` | `string` or `undefined` |  下载文件名，如果不传入将使用默认值作为文件名（传入的文件名可以不带`.csv`) | `react_default_download_csv` |
| `onChange` | `否` | `(data: CSVData[], fields?: string[]) => Promise<CSVData[]>` |  数据监听 | `div` |
| `children` | `否` | `React.ReactNode` |  子组件 | `null` |

### CSVImport

用于导入 CSV 文件数据。

| 属性 | 是否必传 |类型| 说明  | 默认值 |
| ---- | -------- | --------- | --------- | --------- |
| `style` | `否` | `CSSProperties` | 组件样式 | |
| `className` | `否` | `string` | 组件类名 | |
| `columns` | `否` | `string[]` | 输出列，当需要保留某几列数据展示时可以使用 |`[]`|
| `disabled` | `否` | `boolean` |  是否屏蔽组件 | `undefined` |
| `onChange` | `否` | `(data: CSVData[], fields?: string[]) => Promise<CSVData[]>` |  数据监听 | `div` |
| `children` | `否` | `React.ReactNode` |  子组件 | `null` |

## License

MIT © [AnizGu](https://raw.githubusercontent.com/AnizGu/react-csv/main/LICENSE)
