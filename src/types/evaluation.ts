// 项目基本信息
export interface IProjectInfo {
    projectName: string;  // 招标项目名称
    projectCode: string;  // 招标编号
    evaluationDate: string;  // 评标时间
}

// 初评表数据
export interface IPreEvaluation {
    projectName: string;
    projectCode: string;
    evaluationDate: string;
    experts: string[];  // 专家简称数组
    evaluationItems: Array<{
        name: string;  // 评审标准类别名称
        items: Array<{
            factor: string;  // 评审因素
            reference: string;  // 评审标准
            scores: {  // 各专家的评分（✓/×）
                [key: string]: string;
            };
        }>;
    }>;
}

export interface IEvaluationItem {
    factor: string;
    value: string;
    scores: number[];  // 各专家的评分数组
}

interface IEvaluationCategory {
    name: string;
    items: IEvaluationItem[];
}

// 报价计算表数据
export interface IPriceEvaluation {
    projectName: string;
    projectCode: string;
    evaluationDate: string;
    bidders: Array<{
        name: string;
        price: number;
        basePrice: number;
        deviation: number;
        score: number;
    }>;
}

// 专家打分表数据
export interface IExpertScoring {
    projectName: string;
    projectCode: string;
    evaluationDate: string;
    experts: string[];  // 专家简称数组
    businessItems: IEvaluationCategory[];
    techItems: IEvaluationCategory[];
    businessScores: number[];  // 商务部分各专家总分
    techScores: number[];  // 技术部分各专家总分
}

// 专家评分汇总表数据
export interface IExpertSummary {
    projectName: string;
    projectCode: string;
    evaluationDate: string;
    experts: string[];  // 专家简称数组
    scores: number[][];  // 每行得分数组
} 