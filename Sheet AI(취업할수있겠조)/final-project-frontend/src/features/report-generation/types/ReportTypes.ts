export interface ReportData {
  json: {
    company_name: string;
    report_data: {
      company_name: string;
      subtitle: string;
      summary_content: string;
      detailed_content: string;
      generation_date: string;
      industry_name: string;
      market_type: string;
      financial_data?: any;
      sections?: {
        title: string;
        description: string;
        content: string;
      }[];
    };
    sections: {
      title: string;
      description?: string;
      content: string;
    }[];
    generated_at: string;
    report_type: string;
    credit_rating?: string;
    summary_card_structured?: SummaryCardStructured;
    news_data?: NewsItem[];
  };
  company_name?: string;
  report_data?: {
    company_name: string;
    subtitle: string;
    summary_content: string;
    detailed_content: string;
    generation_date: string;
    industry_name: string;
    market_type: string;
    financial_data?: any;
    sections?: {
      title: string;
      description: string;
      content: string;
    }[];
  };
  sections?: {
    title: string;
    description?: string;
    content: string;
  }[];
  generated_at?: string;
  report_type?: string;
  credit_rating?: string;
  summary_card_structured?: SummaryCardStructured;
  news_data?: NewsItem[];
}

export interface FinancialMetrics {
  roa: number;
  roe: number;
  debtRatio: number;
  operatingProfitMargin: number;
}

export interface RatingInfo {
  color: string;
  progress: number;
  message?: string;
}

export interface IndustryInfo {
  industry: string;
  market: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

export interface SummaryCardStructured {
  company_name: string;
  evaluation_date: string;
  credit_rating: string;
  strengths: string[];
  weaknesses: string[];
  financial_metrics: {
    roa: {
      value: number;
      evaluation: string;
      color_grade?: string;
      display_value?: string;
    };
    roe: {
      value: number;
      evaluation: string;
      color_grade?: string;
      display_value?: string;
    };
    debt_ratio: {
      value: number;
      evaluation: string;
      color_grade?: string;
      display_value?: string;
    };
    operating_profit_margin: {
      value: number;
      evaluation: string;
      color_grade?: string;
      display_value?: string;
    };
  };
  credit_rating_trend: {
    direction: string;
    reason: string;
  };
  financial_stability: string;
  business_risk: string;
  industry_outlook: string;
}

export interface NewsItem {
  title: string;
  url: string;
  image_url?: string;
  source?: string;
  published_date?: string;
  summary?: string;
}
