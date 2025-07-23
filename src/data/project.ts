const data = {
  // プロジェクト情報
  siteName: 'develop',
  siteDescription: 'test description',
  baseUrl: '/', // ex: '/', '/sample/'
  port: 4321,
};

const siteUrls = {
  developmentUrl: `http://localhost:${data.port}/`,
  stagingUrl: 'https://staging.example.com/',
  productionUrl: 'https://example.com/',
};

// 環境変数に基づいてsiteUrlを計算
const environment = process.env.NODE_ENV;
let siteUrl: string;
if (environment === 'development') {
  siteUrl = siteUrls.developmentUrl;
} else if (environment === 'staging') {
  siteUrl = siteUrls.stagingUrl;
} else {
  siteUrl = siteUrls.productionUrl;
}

export default { ...data, siteUrl };
