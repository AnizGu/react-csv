import axios from 'axios';
import { first, isArray, isNull, isObject, isString, isUndefined, map, pick } from 'lodash';
import { ParseResult, parse, unparse } from 'papaparse';

export type CSVData = {
    [key: string]: any;
}

export interface CSVConfig {
    filename?: string;
    columns?: string[];
    onChange?: (data: CSVData[], fields?: string[]) => void | Promise<CSVData[]>;
}

export class CSVController {

    private readonly DEFAULT_DOWNLOAD_FILE_NAME: string = "react_default_download_csv";
    private config: CSVConfig = {
        filename: this.DEFAULT_DOWNLOAD_FILE_NAME
    };

    constructor(config: CSVConfig) {
        this.setConfig(config);
    }

    setConfig(config: CSVConfig) {
        this.config = { ...this.config, ...config };
    }

    getConfig() {
        return this.config;
    }

    private isCSVData(data: any): data is CSVData {
        return !isNaN(data) && !isNull(data) && !isUndefined(data) && !isArray(data) && isObject(data);
    }

    private isBlob(blob: any): blob is Blob {
        return blob instanceof Blob;
    }

    private isCSVDatas(datas: any): datas is CSVData[] {
        return isArray(datas) && datas.every((item) => typeof item === 'object' && item !== null);
    }

    private isValidCSV(value: any): value is string {
        if (!isString(value)) return false;
        return /^("[^"]*"|[^,]+)(,("[^"]*"|[^,]+))*(\n("[^"]*"|[^,]+)(,("[^"]*"|[^,]+))*)*$/.test(value);
    }

    private isURL(url: any): url is URL {
        try {
            if (!(url instanceof URL)) return false;
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (error) {
            return false;
        }
    }

    private isLink(value: any): value is string {
        if (!isString(value)) return false;
        return /^https?:\/\//i.test(value);
    }

    private createFileName(filename?: string) {
        if (!filename)
            return this.DEFAULT_DOWNLOAD_FILE_NAME;
        if (!filename.endsWith('.csv'))
            return first(filename.split('.')) || this.DEFAULT_DOWNLOAD_FILE_NAME;
        return filename;
    }

    private isSingleColumn(data: CSVData[]) {
        if (!isArray(data))
            return false;
        return data.every(item => typeof item === 'object' && Object.keys(item).length === 1);
    }

    private async processingBlob(blob: Blob) {
        const csvData = await this.readAsBlob(blob);
        return new Blob([unparse(csvData.data, { delimiter: this.isSingleColumn(csvData.data) ? '' : ',' })], { type: 'text/csv;charset=utf-8;' });
    }

    async readAsBlob(blob: Blob) {
        const { columns, onChange } = this.config;
        return new Promise<ParseResult<CSVData>>(resolve => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                let result = e.target?.result;
                if (isString(result)) {
                    const oriData = parse<CSVData>(result, { header: true, dynamicTyping: true });
                    if (columns && columns.length)
                        oriData.data = map(oriData.data, data => pick(data, columns));
                    if (onChange) {
                        const processedData = await onChange(oriData.data, oriData.meta.fields);
                        if (this.isCSVData(processedData)) {
                            oriData.data = processedData;
                        }
                    }
                    return resolve(oriData);
                }
            }
            reader.readAsText(blob, 'utf-8');
        });
    }

    async createFromURL(url: URL) {
        try {
            const response = await axios(url.href, {
                method: "GET",
                responseType: 'blob'
            });
            if (response.status === 200 && this.isBlob(response.data)) {
                let blob = response.data;
                if (blob.type !== 'text/csv') {
                    console.warn(`Invalid CSV download address: ${url.href}`);
                    return;
                }
                blob = await this.processingBlob(blob);
                return URL.createObjectURL(blob);
            }
            console.warn(`Invalid CSV download address: ${url.href}`)
        } catch (error) {
            throw new Error(`Invalid CSV download address: ${url.href}`)
        }
    }

    async createFromDatas(datas: string | CSVData[]) {
        if (this.isValidCSV(datas)) {
            const parsedData = parse<CSVData>(datas, { header: true });
            if (!parsedData.data.length)
                datas = datas.split('\\n').map((row) => row.split(','));
        }
        let blob = new Blob([this.isCSVDatas(datas) ? unparse(datas) : datas], { type: 'text/csv;charset=utf-8;' });
        blob = await this.processingBlob(blob);
        return URL.createObjectURL(blob);
    }

    async download(datas: string | URL | CSVData[]) {
        if (this.isURL(datas))
            return await this.createFromURL(datas);
        if (this.isLink(datas))
            return await this.createFromURL(new URL(datas));
        return await this.createFromDatas(datas);
    }

    async click(url: string) {
        const { filename } = this.config;
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = this.createFileName(filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}