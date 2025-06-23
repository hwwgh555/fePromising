import ExcelJS, { type Workbook, type Worksheet } from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

interface ExcelInitOptions {
    filename: string;
    sheetName: string;
}

export const useExcelExport = () => {
    const initWorkbook = async (options: ExcelInitOptions) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(options.sheetName, {
                properties: { defaultRowHeight: 25 }
            });
            return [workbook, worksheet] as const;
        } catch (error) {
            toast.error('初始化Excel失败');
            throw error;
        }
    };

    const exportToExcel = async (workbook: ExcelJS.Workbook, filename: string) => {
        try {
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), filename);
            toast.success('导出成功');
        } catch (error) {
            toast.error('导出失败');
            throw error;
        }
    };

    return {
        initWorkbook,
        exportToExcel
    };
};