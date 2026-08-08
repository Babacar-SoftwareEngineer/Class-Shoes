import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 200 },
    { duration: '2m', target: 500 },
    { duration: '1m', target: 100 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const CATEGORY_IDS = [1, 2, 4, 8];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function () {
  const page = getRandomInt(1, 3);
  const limit = 12;
  const categoryId = CATEGORY_IDS[getRandomInt(0, CATEGORY_IDS.length - 1)];
  const sortBy = ['CreatedAt', 'Price', 'ProductName'][getRandomInt(0, 2)];
  const sortOrder = ['asc', 'desc'][getRandomInt(0, 1)];

  const catalogRes = http.get(
    `${BASE_URL}/api/products?page=${page}&limit=${limit}&categoryId=${categoryId}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );

  const catalogCheck = check(catalogRes, {
    'catalog status is 200': (res) => res.status === 200,
    'catalog returns success flag': (res) => {
      try {
        const body = JSON.parse(res.body || '{}');
        return body.success === true && Array.isArray(body.data);
      } catch {
        return false;
      }
    },
  });

  if (!catalogCheck) {
    sleep(0.2);
    return;
  }

  const body = JSON.parse(catalogRes.body || '{}');
  const products = body.data || [];

  if (products.length > 0) {
    const randomProduct = products[getRandomInt(0, products.length - 1)];

    const detailRes = http.get(`${BASE_URL}/api/products/${randomProduct.ProductId}`);

    check(detailRes, {
      'detail status is 200': (res) => res.status === 200,
      'detail returns product payload': (res) => {
        try {
          const detailBody = JSON.parse(res.body || '{}');
          return detailBody.success === true && Boolean(detailBody.data);
        } catch {
          return false;
        }
      },
    });
  }

  sleep(Math.random() * 1.5 + 0.5);
}
