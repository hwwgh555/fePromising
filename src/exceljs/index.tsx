import React, { useRef, useState } from "react";
import type { Workbook } from "exceljs";
import { generatePriceExcelSheet, mockPriceEvaluation } from "./generatePriceExcelSheet";
import { generateBusinessAndTechExcelSheet, mockExpertScoring } from "./generateBusinessAndTechExcelSheet";
import { generateSummaryExcelSheet, mockExpertSummary } from "./generateSummaryExcelSheet";
import { exportExcel, createExcelWorkbook } from "./excel";
import type { IExpertScoring, IExpertSummary, IPriceEvaluation } from "../types/evaluation";

// 评分类型常量与类型（全局唯一源）
export const SCORE_TYPE_LIST = [
  { label: "报价打分", value: "price" },
  { label: "商务打分", value: "business" },
  { label: "技术打分", value: "tech" }, // 如需技术评分表可解开
  { label: "综合打分", value: "summary" },
] as const;
export type ScoreType = (typeof SCORE_TYPE_LIST)[number]["value"];

export default function ExcelTest(): React.ReactElement {
  const projectNameRef = useRef("xxxxxx");

  const getScoreList = async ({ type }: { type: ScoreType }) => {

    if (type == 'price') {
      return mockPriceEvaluation;
    }
    if (type == 'business' || type == 'tech') {
      return mockExpertScoring;
    }
    if (type == 'summary') {
      return mockExpertSummary;
    }
  };

  const handleExportPrice = async ({ workbook }: { workbook: Workbook }) => {
    const result = await getScoreList({ type: "price" }) as unknown as IPriceEvaluation;

    generatePriceExcelSheet({
      workbook,
      projectName: result!.projectName || "",
      projectCode: result!.projectCode || "",
      records: result!.bidders.map((item) => ({
        name: item.name,
        price: Number(item.price),
        basePrice: Number(item.basePrice),
        deviation: Number(item.deviation),
        score: Number(item.score),
      })),
    });
  };

  const handleExportBusinessAndTech = async ({
    workbook,
  }: {
    workbook: Workbook;
  }) => {
    const result = (await getScoreList({ type: "tech" })) as unknown as IExpertScoring;
    if (!result) return;

    generateBusinessAndTechExcelSheet({
      workbook,
      projectName: result.projectName,
      projectCode: result.projectCode,
      techTotalScore: result.techScores,
      techItems: result.techItems,
      businessTotalScore: result?.businessScores,
      businessItems: result?.businessItems,
    });
  };

  const handleExportSummary = async ({ workbook }: { workbook: Workbook }) => {
    const result = (await getScoreList({ type: "summary" })) as unknown as IExpertSummary;

    generateSummaryExcelSheet({
      workbook,
      projectName: result.projectName,
      projectCode: result.projectCode,
      experts: result.experts,
      scores: result.scores,
      techTotalScore: "100",
      businessTotalScore: "80",
      priceTotalScore:  "60",
    });
  };

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    if (isExporting) {
      return;
    }
    setIsExporting(true);
    try {
      const workbook = createExcelWorkbook();
      await handleExportSummary({ workbook });
      // await handleExportPrice({ workbook });
      // await handleExportBusinessAndTech({ workbook });
      exportExcel(
        workbook,
        `${projectNameRef.current || "项目"}-打分结果-${new Date()
          .toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(/[\/\s:]/g, "")}.xlsx`
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button onClick={handleExport}>
      {isExporting ? "导出中..." : "导出"}
    </button>
  );
}
