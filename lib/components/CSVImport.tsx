import classNames from 'classnames';
import { CSSProperties, ChangeEvent, createRef } from 'react';
import styled from 'styled-components';
import { CSVConfig, CSVController } from '../tools/CSVController';

export interface CSVImportProps extends Omit<CSVConfig, "filename"> {
    style?: CSSProperties;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
}

const ImportWrapper = styled.span`
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.88);
    list-style: none;
`;

const ImportSelect = styled.div`
    display: inline-block;
    outlint: none;
`;

const ImportUpload = styled.span`
    outlint: none;
`;

export const CSVImport: React.FC<CSVImportProps> = ({ style, className, columns = [], disabled, onChange, children }) => {

    const inputRef = createRef<HTMLInputElement>();

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files) {
            const file = e.target.files[0]
            const controller = new CSVController({
                columns,
                onChange
            });
            await controller.readAsBlob(file);
        }
    };

    const handleUpload = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    return (
        <ImportWrapper className={classNames('react-csv-import-wrapper', className)}>
            <ImportSelect style={style}>
                <ImportUpload onMouseDown={handleUpload}>
                    <input ref={inputRef} accept='text/csv' type="file" style={{ display: 'none' }} onChange={handleChange}></input>
                    {children}
                </ImportUpload>
            </ImportSelect>
        </ImportWrapper>
    )
}