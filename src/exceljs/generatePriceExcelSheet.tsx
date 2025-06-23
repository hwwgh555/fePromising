import { cellStyles, applyBorders, addProjectInfo, addDiagonalCell, getCurDate} from './excel';
import type { IPriceEvaluation } from '../types/evaluation';
import type { Workbook } from 'exceljs';

export const mockPriceEvaluation: IPriceEvaluation = {
  projectName: 'XXXXXXXX采购项目',
  projectCode: 'ZHDF-XX-XXZB-22-XXXX',
  evaluationDate:
    new Date()
      .toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
        formatMatcher: 'basic',
      })
      .replace(/\//g, '年')
      .replace(/\//g, '月') + '日', // 如，2025年04月21日
  bidders: [
    { name: '投标人A', price: 1000000, basePrice: 980000, deviation: 0.0204, score: 34.18 },
    { name: '投标人B', price: 950000, basePrice: 980000, deviation: -0.0306, score: 33.39 },
    { name: '投标人C', price: 990000, basePrice: 980000, deviation: 0.0102, score: 35.0 },
    { name: '投标人D', price: 990000, basePrice: 980000, deviation: 0.0102, score: 35.0 },
  ],
};

// 导出报价计算表
export const generatePriceExcelSheet = ({
  workbook,
  records = [],
  projectName = '项目',
  projectCode = 'ZHDF-XX-XXZB-22-XXXX',
}: {
  workbook: Workbook;
  records: IPriceEvaluation['bidders'];
  projectName: string;
  projectCode: string;
}) => {

  const worksheet = workbook.addWorksheet('报价计算表', {
    properties: { defaultRowHeight: 25 },
  });

  // 设置列宽
  worksheet.columns = [
    { width: 30 }, // 投标人
    { width: 20 }, // 评标价
    { width: 20 }, // 评标基准价
    { width: 15 }, // 偏差率
    { width: 20 }, // 投标报价得分
  ];

  const curDate = getCurDate();

  addProjectInfo(worksheet, {
    projectCode,
    projectName,
    evaluationDate: curDate,
  }, {
    titleMergeRange: 'A1:E1',
    projectMergeRange: 'A2:E2',
    infoMergeRange: { left: 'A3:C3', right: 'D3:E3' },
    title: '报价计算表',
  });

  // 修改标题字体大小
  worksheet.getCell('A1').font = { size: 24, bold: true };
  // 修改项目信息字体大小
  worksheet.getCell('A2').font = { size: 12 };
  worksheet.getCell('A3').font = { size: 12 };
  // 修改评标时间字体大小
  const priceDateCell = worksheet.getCell('D3');
  priceDateCell.font = { size: 12 };

  // 将"招标编号"修改为"项目编号"
  const codeCell = worksheet.getCell('A3');
  codeCell.value = `项目编号：${projectCode}`;

  // 设置表头
  const headerRow = worksheet.getRow(4);

  // 创建对角线单元格（从左上到右下）
  const diagonalCell = headerRow.getCell(1);
  addDiagonalCell(worksheet, diagonalCell, 'top-bottom'); // 修改为从左上到右下

  // 设置对角线单元格文本
  diagonalCell.value = {
    richText: [
      { text: '            评审项目', font: { bold: true, size: 14 } },
      { text: '\n 投标人', font: { bold: true, size: 14 } },
    ],
  };
  diagonalCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

  const headers = ['', '评标价', '评标基准价（修正后）', '偏差率 δ', '投标报价得分'];

  headers.forEach((header, index) => {
    if (index > 0) {
      const cell = headerRow.getCell(index + 1);
      cell.value = header;
      Object.assign(cell, cellStyles.header);
      cell.font = { size: 14, bold: true };
      applyBorders(cell);
      // 合并评标基准价单元格头
      if (index === 2) {
        worksheet.mergeCells(4, index + 1, 5, index + 1);
      }
    }
  });

  // 合并表头单元格
  worksheet.mergeCells('A4:A5');
  worksheet.mergeCells('B4:B5');
  worksheet.mergeCells('D4:D5');
  worksheet.mergeCells('E4:E5');

  // 添加数据
  let rowIndex = 6;
  let basePrice = '';

  records.forEach((bidder, index) => {
    if (index === 0 && bidder.basePrice) {
      basePrice = bidder.basePrice.toFixed(2);
    }
    const row = worksheet.getRow(rowIndex);
    row.values = [
      bidder.name,
      bidder.price.toFixed(2),
      '', // 评标基准价将在所有数据行合并后填充
      bidder.deviation ? `${(bidder.deviation).toFixed(2)}%` : '',
      bidder.score?.toFixed(2) || '',
    ];
    row.eachCell(cell => {
      cell.font = { size: 14 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      applyBorders(cell);
      // 移除背景色
    });
    rowIndex++;
  });

  // 合并评标基准价单元格并填充数据
  const firstDataRow = 6;
  const lastDataRow = rowIndex - 1;
  worksheet.mergeCells(firstDataRow, 3, lastDataRow, 3);
  const basePriceCell = worksheet.getCell(`C${firstDataRow}`);
  basePriceCell.value = basePrice;
  basePriceCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  applyBorders(basePriceCell);

  // 添加评分规则和评委签名（2等分），紧挨着上表
  // 评分规则（左侧）
  const ruleRow = worksheet.getRow(rowIndex);
  worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
  const ruleTitleCell = ruleRow.getCell(1);
  ruleTitleCell.value = '评分规则：';
  ruleTitleCell.font = { size: 12, bold: true };
  ruleTitleCell.alignment = { vertical: 'middle' };
  applyBorders(ruleTitleCell);
  delete ruleTitleCell.border.bottom;

  // 评委签名（右侧）
  worksheet.mergeCells(`C${rowIndex}:E${rowIndex}`);
  const signatureCell = ruleRow.getCell(3);
  signatureCell.value = '评委签名：';
  signatureCell.font = { size: 12, bold: true };
  signatureCell.alignment = { vertical: 'middle' };
  applyBorders(signatureCell);
  delete signatureCell.border.bottom;

  // 评分规则内容
  rowIndex++;
  worksheet.mergeCells(`A${rowIndex}:B${rowIndex + 10}`);
  const ruleCell = worksheet.getCell(`A${rowIndex}`);
  ruleCell.value = `1、评标基准价=参与评标基准价计算的各报价之和/参与评标基准价计算的报价数量×调整系数μ（μ=0.9）

价格高于/低于平均价30%以上的投标报价将被剔除。按偏高至高低至一剔除，
直至剩余有效投标报价均在其平均价的30%或剩余两家投标价；若价格高低偏差
相同时，优先剔除高价。

2、δ = (修正投标价-评标基准价)/评标基准价*100%
δ =0~2%时,修正报价分值为满分35分；
δ >0时,修正投标价每高一个百分点扣0.4 分；
δ <-2%时,修正投标价每低一个百分点扣0.2 分。
报价得分最低分25分。`;
  ruleCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
  ruleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC00' } }; // 添加黄色背景
  ruleCell.font = { size: 10 }; // 设置字体大小为10

  ruleCell.border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: undefined,
    bottom: { style: 'thin' },
  };

  // 评委签名区域（留白）
  worksheet.mergeCells(`C${rowIndex}:E${rowIndex + 10}`);
  const signatureAreaCell = worksheet.getCell(`C${rowIndex}`);
  signatureAreaCell.alignment = { vertical: 'top', horizontal: 'left' };
  signatureAreaCell.font = { size: 10 }; // 设置字体大小为10

  signatureAreaCell.border = {
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: undefined,
    bottom: { style: 'thin' },
  };

  return workbook;
};
