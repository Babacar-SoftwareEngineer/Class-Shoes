# Load tests for the catalogue API

This folder contains a K6 load test targeting the products catalogue endpoint.

## File

- `catalog-load-test.js`

## Run locally

```bash
BASE_URL=http://localhost:5000 k6 run load-tests/catalog-load-test.js
```

## What it simulates

- browsing the catalogue
- category filtering
- sorting variations
- random product detail requests

## Main thresholds

- p95 request duration < 500 ms
- error rate < 1%
- checks success rate > 99%
