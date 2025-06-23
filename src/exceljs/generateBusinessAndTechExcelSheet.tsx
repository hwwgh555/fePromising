import { applyBorders, getCurDate  } from './excel';
import type { Workbook, Cell, Worksheet  } from 'exceljs';

// 专家打分表模拟数据
type IExpertScoringItem = (string | number)[];
interface IExpertScoring {
  projectName: string;
  projectCode: string;
  evaluationDate: string;
  businessItems: IExpertScoringItem[];
  techItems: IExpertScoringItem[];
}

export const mockExpertScoring: IExpertScoring = {
  // 项目基本信息
  projectName: 'XXXXXXXX采购项目', // 招标项目名称
  projectCode: 'ZHDF-XX-XXZB-22-XXXX', // 项目编号
  evaluationDate: '2024年04月21日', // 评标时间

  // 商务评分项（总分15分）
  businessItems: [
    ['评分项目', '评分标准', '分值', '简称1', '简称2', '简称3', '简称4', '简称5', '简称6'],
    [
      '1、公司资质（7分）',
      '投标人具有信息系统集成及服务资质证书',
      '0/0.5/1',
      0.5,
      1,
      0.5,
      0,
      0.5,
      0,
    ],
    [
      '2、业绩（4分）',
      '近3年内投标人具有档案管理合数字化加工建设项目案例',
      '0-4',
      2.5,
      3,
      4,
      3.5,
      2,
      0,
    ],
  ],

  // 技术评分项（总分50分）
  techItems: [
    ['评分项目', '评分标准', '分值', '简称1', '简称2', '简称3', '简称4', '简称5'],
    ['1、软硬件方案（16分）', '响应技术方案与技术规格书的符合程度', '0-4', 3.5, 3.8, 3.2, 3.6, 3.4],
    ['2、供货清单的完整性，与项目需求的符合程度', 'xxxxxxxxxx', '0-4', 3.8, 3.5, 3.7, 3.6, 3.9],
  ],
};

export const generateBusinessAndTechExcelSheet = async ({
  workbook,
  businessItems,
  techItems,
  techTotalScore,
  businessTotalScore,
  projectName = '项目',
  projectCode = 'ZHDF-XX-XXZB-22-XXXX',
}: {
  workbook: Workbook;
  businessItems: IExpertScoringItem[];
  techItems: IExpertScoringItem[];
  techTotalScore: string;
  businessTotalScore: string;
  projectName: string;
  projectCode: string;
}) => {
  const worksheet = workbook.addWorksheet('专家打分表', {
    properties: { defaultRowHeight: 25 }
  });

  // 设置列宽
  worksheet.columns = [
    { width: 40 }, // 评分项目
    { width: 40 }, // 评分标准
    { width: 10 }, // 分值
  ];

  // 添加标题行
  const titleRow = worksheet.getRow(1);
  worksheet.mergeCells('A1:H1');
  const titleCell = titleRow.getCell(1);
  titleCell.value = '专家打分表';
  titleCell.font = { size: 20, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // 添加项目名称和编号（字体大小10）
  const projectNameRow = worksheet.getRow(2);
  worksheet.mergeCells('A2:H2');
  projectNameRow.getCell(1).value = `招标项目：${projectName}`;
  projectNameRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
  projectNameRow.getCell(1).font = { size: 10 };

  const projectCodeRow = worksheet.getRow(3);
  worksheet.mergeCells('A3:H3');
  projectCodeRow.getCell(1).value = `项目编号：${projectCode}`;
  projectCodeRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
  projectCodeRow.getCell(1).font = { size: 10 };

  // 渲染评分部分的通用函数
  const renderScoringSection = (
    startRow: number,
    title: string,
    items: IExpertScoringItem[],
    worksheet: Worksheet
  ) => {
    let rowIndex = startRow;

    // 动态总列数
    const totalCols = items[0].length;

    // 添加部分标题
    const sectionRow = worksheet.getRow(rowIndex);
    worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
    worksheet.mergeCells(rowIndex, 4, rowIndex, totalCols);
    sectionRow.getCell(1).value = title;
    sectionRow.getCell(1).font = { size: 12, bold: true };
    sectionRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };

    const evaluationDate = getCurDate();
    sectionRow.getCell(5).value = `评标时间：${evaluationDate}`;
    sectionRow.getCell(5).font = { size: 12 };
    sectionRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
    rowIndex++;

    // 渲染表头（两行合并）
    const headerRow1 = worksheet.getRow(rowIndex);
    const headerRow2 = worksheet.getRow(rowIndex + 1);

    // 前3列纵向合并2行
    for (let col = 1; col <= 3; col++) {
      worksheet.mergeCells(rowIndex, col, rowIndex + 1, col);
      const cell = headerRow1.getCell(col);
      cell.value = items[0][col - 1];
      cell.font = { size: 12, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      applyBorders(cell);
    }

    // 第4列到最后一列横向合并，第一行写"评审得分"
    if (totalCols > 3) {
      worksheet.mergeCells(rowIndex, 4, rowIndex, totalCols);
      const scoreCell = headerRow1.getCell(4);
      scoreCell.value = '评审得分';
      scoreCell.font = { size: 12, bold: true };
      scoreCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      scoreCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      applyBorders(scoreCell);

      // 第二行第4列到最后一列写简称
      for (let col = 4; col <= totalCols; col++) {
        const cell = headerRow2.getCell(col);
        cell.value = items[0][col - 1];
        cell.font = { size: 12, bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        applyBorders(cell);
        worksheet.getColumn(col).width = 20; // 设置列宽为15
      }
    }

    rowIndex += 2;

    // 渲染数据行
    for (let i = 1; i < items.length; i++) {
      const row = worksheet.getRow(rowIndex);
      items[i].forEach((cellValue, colIdx) => {
        const cell = row.getCell(colIdx + 1);
        cell.value = cellValue;
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        applyBorders(cell);
        // 前三列添加黄色背景
        if (colIdx < 3) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCC00' } };
        }
      });
      rowIndex++;
    }

    // 添加得分合计
    const totalRow = worksheet.getRow(rowIndex);
    worksheet.mergeCells(`A${rowIndex}:C${rowIndex}`);
    const totalCell = totalRow.getCell(1);
    totalCell.value = title.includes('商务') ? '商务得分合计：' : '技术得分合计：';
    totalCell.font = { size: 12, bold: true };
    totalCell.alignment = { vertical: 'middle', horizontal: 'right' };

    // 计算每个专家的总分（第4~最后列）
    for (let expertIdx = 3; expertIdx < totalCols; expertIdx++) {
      let totalScore = 0;
      for (let i = 1; i < items.length; i++) {
        const val = items[i][expertIdx];
        if (typeof val === 'number') totalScore += val;
        if (typeof val === 'string' && !isNaN(Number(val))) totalScore += Number(val);
      }
      const cell = totalRow.getCell(expertIdx + 1);
      cell.value = totalScore.toFixed(1);
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }
    totalRow.eachCell((cell: Cell) => {
      applyBorders(cell);
    });
    rowIndex++;

    // 添加专家签字和评标时间
    const signatureRow = worksheet.getRow(rowIndex);
    worksheet.mergeCells(`A${rowIndex}:H${rowIndex}`);
    signatureRow.getCell(1).value = '专家签字：　　　　　　　　　　　　　　　　　';
    signatureRow.getCell(1).font = { size: 12 };
    signatureRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'right' };
    rowIndex++;

    const dateRow = worksheet.getRow(rowIndex);
    worksheet.mergeCells(`A${rowIndex}:H${rowIndex}`);
    dateRow.getCell(1).value = '评标时间：　　　　　　　　　　　　　　　　　';
    dateRow.getCell(1).font = { size: 12 };
    dateRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'right' };
    rowIndex += 2;

    return rowIndex;
  };

  // 商务部分数据
  // const businessItems = mockExpertScoring.businessItems;

  // 技术部分数据
  // const technicalItems = mockExpertScoring.technicalItems;
  // const technicalItems = techItems;

  // 渲染商务部分
  let currentRow = 5;
  currentRow = renderScoringSection(
    currentRow,
    `1）商务部分评分（${businessTotalScore}分）`,
    businessItems,
    worksheet
  );

  // 渲染技术部分
  currentRow = renderScoringSection(
    currentRow,
    `2）技术部分评分（${techTotalScore}分）`,
    techItems,
    worksheet
  );

  // 确保所有单元格文本能完全显示
  worksheet.eachRow(row => {
    row.eachCell({ includeEmpty: false }, cell => {
      if (cell.value && typeof cell.value === 'string') {
        // 设置自动调整行高
        const rowHeight = Math.max(cell.value.split('\n').length * 15, 30); // 基于行数和最小高度计算
        row.height = rowHeight;
      }
    });
  });

  return workbook;
};
