import classNames from 'classnames';
import { compact } from 'lodash';
import { CSSProperties, MouseEvent, createElement } from 'react';
import { CSVController } from '../tools';
import { CSVConfig, CSVData } from '../tools/CSVController';

export interface CSVDownloadProps extends CSVConfig {
    datas: string | URL | CSVData[];
    style?: CSSProperties;
    className?: string;
    disabled?: boolean;
    wrapper?: string;
    children?: React.ReactNode;
}

export const CSVDownload: React.FC<CSVDownloadProps> = ({ datas, disabled, wrapper = 'div', columns = [], style, className, filename, onChange, children }) => {

    const handleClick = async (e: MouseEvent) => {
        e.preventDefault();
        if (disabled) return;
        const controller = new CSVController({
            columns: compact(columns),
            filename,
            onChange
        });
        const url = await controller.download(datas);
        if (url)
            controller.click(url);
    }

    const CSVDownloadWrapper = createElement(wrapper, {
        style,
        className: classNames('react-csv-download-wrapper', className),
        children,
        onClick: handleClick
    });

    return CSVDownloadWrapper;
}