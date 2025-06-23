import type { Worksheet, Cell } from 'exceljs';
import type { IProjectInfo } from '../types/evaluation';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

// 单元格样式
export const cellStyles = {
    header: {
        font: { bold: true },
        fill: {
            type: 'pattern' as const,
            pattern: 'solid' as const,
            fgColor: { argb: 'FFD9D9D9' }
        },
        alignment: {
            vertical: 'middle' as const,
            horizontal: 'center' as const,
            wrapText: true
        }
    },
    normal: {
        alignment: {
            vertical: 'middle' as const,
            horizontal: 'center' as const,
            wrapText: true
        }
    },
    title: {
        font: { size: 16, bold: true, underline: true },
        alignment: {
            vertical: 'middle' as const,
            horizontal: 'center' as const
        }
    },
    projectInfo: {
        alignment: {
            vertical: 'middle' as const,
            horizontal: 'left' as const
        }
    },
    evaluationDate: {
        alignment: {
            vertical: 'middle' as const,
            horizontal: 'right' as const
        }
    },
    ruleTitle: {
        font: { bold: true },
        alignment: {
            vertical: 'middle' as const,
            horizontal: 'left' as const
        }
    },
    rule: {
        alignment: {
            vertical: 'top' as const,
            horizontal: 'left' as const,
            wrapText: true
        }
    },
    diagonal: {
        fill: {
            type: 'pattern' as const,
            pattern: 'solid' as const,
            fgColor: { argb: 'FFD9D9D9' }
        },
        border: {
            diagonal: { style: 'thin' },
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        },
        alignment: {
            vertical: 'middle' as const,
            horizontal: 'center' as const,
            wrapText: true
        }
    }
};

// 添加边框
export const applyBorders = (cell: Cell) => {
    cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
};

// 添加项目信息
export const addProjectInfo = (
    worksheet: Worksheet,
    data: IProjectInfo,
    options: {
        titleMergeRange: string;
        projectMergeRange: string;
        infoMergeRange: { left: string; right: string };
        title?: string;
        underlineTitle?: boolean;
    }
) => {
    // 标题
    worksheet.mergeCells(options.titleMergeRange);
    const titleCell = worksheet.getCell(options.titleMergeRange.split(':')[0]);
    titleCell.value = options.title || "初　评　表";

    // 设置标题样式
    if (options.underlineTitle === true) {
        // 默认带下划线
        Object.assign(titleCell, cellStyles.title);
    } else {
        // 不带下划线
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    }

    // 项目信息
    worksheet.mergeCells(options.projectMergeRange);
    const projectCell = worksheet.getCell(options.projectMergeRange.split(':')[0]);
    projectCell.value = `招标项目：${data.projectName}`;
    Object.assign(projectCell, cellStyles.projectInfo);

    // 编号和日期
    worksheet.mergeCells(options.infoMergeRange.left);
    const codeCell = worksheet.getCell(options.infoMergeRange.left.split(':')[0]);
    codeCell.value = `招标编号：${data.projectCode}`;
    Object.assign(codeCell, cellStyles.projectInfo);

    worksheet.mergeCells(options.infoMergeRange.right);
    const dateCell = worksheet.getCell(options.infoMergeRange.right.split(':')[0]);
    dateCell.value = `评标时间：${data.evaluationDate}`;
    Object.assign(dateCell, cellStyles.evaluationDate);
};

// 添加斜线单元格
export const addDiagonalCell = (worksheet: Worksheet, cell: Cell, direction?: 'top-bottom' | 'bottom-top') => {
    Object.assign(cell, cellStyles.diagonal);

    // 设置对角线方向 (默认为bottom-top，从左下到右上)
    if (direction === 'top-bottom') {
        // 从左上到右下
        cell.border = {
            ...cell.border,
            diagonal: { style: 'thin', up: false, down: true }
        };
    } else {
        // 从左下到右上
        cell.border = {
            ...cell.border,
            diagonal: { style: 'thin', up: true, down: false }
        };
    }
};


export const createExcelWorkbook = () => {
  const workbook = new ExcelJS.Workbook();
  return workbook;
};

export const exportExcel = async (workbook: ExcelJS.Workbook, filename: string) => {
    try {
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
        toast.success('导出成功');
    } catch (error) {
        toast.error('导出失败');
        throw error;
    }
};

export const getCurDate = () => {
  const curDate =
    new Date()
      .toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        formatMatcher: 'basic',
      })
      .replace(/\//g, '年')
      .replace(/\//g, '月') + '日'; // 如，2025年04月21日
  return curDate;
};
