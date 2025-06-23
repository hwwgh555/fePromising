import { cellStyles, applyBorders, addProjectInfo, getCurDate} from './excel';
import type { IExpertSummary } from '../types/evaluation';
import type { Workbook } from 'exceljs';

export const mockExpertSummary: IExpertSummary = {
  projectName: 'XXXXXXXX采购项目',
  projectCode: 'ZHDF-XX-XXZB-22-XXXX',
  evaluationDate: '2025年04月21日',
  experts: ['简称1', '简称2', '简称3', '简称4', '简称5', '简称6'],
  scores: [
    [13.5, 14.2, 13.8, 14.0, 13.9, 11], // 商务部分评分
    [45.8, 46.2, 45.5, 46.0, 45.7, 11], // 技术部分评分
    [34.18, 34.18, 34.18, 34.18, 34.18, 11], // 报价部分评分
    [93.48, 94.58, 93.48, 94.18, 93.78, 11], // 合计
    [1, 1, 1, 1, 1, 1], // 名次
  ],
};

export const generateSummaryExcelSheet = async ({
  workbook,
  experts = [],
  scores = [],
  businessTotalScore = '-',
  techTotalScore = '-',
  priceTotalScore = '-',
  projectName = '项目',
  projectCode = 'ZHDF-XX-XXZB-22-XXXX',
}: {
  workbook: Workbook;
  experts: string[];
  scores: number[][];
  techTotalScore: string;
  businessTotalScore: string;
  priceTotalScore: string;
  projectName: string;
  projectCode: string;
}) => {
  const worksheet = workbook.addWorksheet('专家评分汇总表', {
    properties: { defaultRowHeight: 50 },
  });

  // 设置列宽
  worksheet.columns = [
    { width: 8 }, // 序号
    { width: 30 }, // 项目
  ];

  const curDate = getCurDate();

  // 添加标题和项目信息
  addProjectInfo(
    worksheet,
    {
      projectCode,
      projectName,
      evaluationDate: curDate,
    },
    {
      titleMergeRange: 'A1:G1',
      projectMergeRange: 'A2:G2',
      infoMergeRange: {
        left: 'A3:B3',
        right: `C3:${String.fromCharCode(67 + experts.length - 1)}3`,
      },
      title: '专家评分汇总表',
    }
  );

  // 设置标题字体大小为20
  worksheet.getCell('A1').font = { size: 20, bold: true };

  // 修改评标时间为评标日期，并设置字体大小为10
  const summaryDateCell = worksheet.getCell('D3');
  summaryDateCell.font = { size: 10 };

  // 设置项目信息字体大小
  worksheet.getCell('A2').font = { size: 10 };
  worksheet.getCell('A3').font = { size: 10 };

  // 添加表头
  const headerRow1 = worksheet.getRow(4);
  worksheet.mergeCells('A4:A5');
  worksheet.mergeCells('B4:B5');
  worksheet.mergeCells(`C4:${String.fromCharCode(67 + experts.length - 1)}4`);

  headerRow1.getCell(1).value = '序号';
  headerRow1.getCell(2).value = '项目';
  headerRow1.getCell(3).value = '得分';

  headerRow1.eachCell(cell => {
    Object.assign(cell, cellStyles.header);
    cell.font = { size: 14, bold: true };
    applyBorders(cell);
  });

  // 第二行表头（专家简称）
  const headerRow2 = worksheet.getRow(5);
  experts.forEach((expert, index) => {
    const cell = headerRow2.getCell(index + 3);
    cell.value = expert;
    Object.assign(cell, cellStyles.header);
    cell.font = { size: 14, bold: true };
    applyBorders(cell);
    worksheet.getColumn(index + 3).width = 40;
  });

  // 添加数据
  let rowIndex = 6;
  const items = [
    { index: '1', name: `商务部分评分（${businessTotalScore}分）` },
    { index: '2', name: `技术部分评分（${techTotalScore}分）` },
    { index: '3', name: `报价部分评分（${priceTotalScore}分）` },
    { name: '合计（1+2+3）' },
    { name: '名次' },
  ];

  items.forEach((item, idx) => {
    const row = worksheet.getRow(rowIndex);
    if (item.index) {
      // 有序号的行
      row.getCell(1).value = item.index;
      row.getCell(2).value = item.name;
    } else {
      // 合计和名次行需要合并序号和项目列
      worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
      row.getCell(1).value = item.name;
    }

    // 各专家得分
    scores[idx].forEach((score, expertIndex) => {
      row.getCell(3 + expertIndex).value = score;
    });

    // 设置样式
    row.eachCell(cell => {
      Object.assign(cell, cellStyles.normal);
      cell.font = { size: 14, bold: true };
      applyBorders(cell);
    });

    rowIndex++;
  });

  // 添加专家签名
  rowIndex++;
  const signatureRow = worksheet.getRow(rowIndex);
  worksheet.mergeCells(rowIndex, 1, rowIndex, 7);
  const signatureCell = signatureRow.getCell(1);
  signatureCell.value = '评标委员会所有成员签字：';
  signatureCell.font = { size: 14, bold: true };
  signatureCell.alignment = { vertical: 'middle', horizontal: 'left' };

  return workbook;
};
