# Chart demo

This project demonstrates how to use Highcharts to create the figure at https://fred.stlouisfed.org/series/T10Y2Y.

Live demo is available at https://seanzhou1996.github.io/chart-site/.

## Prerequisites

* Node.js v14.16.0+
* Docker

## Develop

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

## Use Docker

Run the following commands:

```bash
docker build -t chart-demo .
docker run -it -d -p 8080:80 --name chart-site chart-demo
```

Then open `http://localhost:8080/` to view the demo.