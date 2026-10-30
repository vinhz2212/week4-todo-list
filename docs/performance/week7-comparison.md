# Week 7 performance report

## Setup

- Baseline: repository commit `70eafb0` (before Week 7 changes).
- Updated build: Week 7 working tree, built with Vite and served locally with `vite preview`.
- Lighthouse 13.6.0, Chrome headless, localhost production builds; one desktop run and two mobile runs for the updated build.
- Lighthouse is a lab simulation. Scores and timings can vary between runs and do not replace field Core Web Vitals.

## Results

| Metric                   | Baseline desktop | Updated desktop | Baseline mobile | Updated mobile (run 1 / run 2) |
| ------------------------ | ---------------: | --------------: | --------------: | -----------------------------: |
| Performance score        |              100 |             100 |             100 |                        97 / 98 |
| First Contentful Paint   |           210 ms |          254 ms |           0.8 s |                  0.9 s / 0.9 s |
| Largest Contentful Paint |           210 ms |          566 ms |           0.8 s |                  2.5 s / 2.4 s |
| Cumulative Layout Shift  |                0 |               0 |               0 |                          0 / 0 |
| Total Blocking Time      |             0 ms |            0 ms |           20 ms |                   10 ms / 0 ms |
| Total transfer size      |          261 KiB |         196 KiB |         261 KiB |                        196 KiB |
| JavaScript transferred   |        201,718 B |       134,623 B |       201,718 B |                      134,623 B |

## Interpretation

Code splitting reduced JavaScript transferred on the initial page load by 33.3% in these local runs. The initial JavaScript bundle also dropped from 632.93 kB (203.02 kB gzip) in the baseline build to 356.70 kB (114.87 kB gzip) in the updated build. Lazy route and dialog chunks load when needed.

The mobile LCP regressed from 0.8 s to 2.4–2.5 s across two updated-build runs, although desktop LCP remained below 0.6 s. This is a real warning in the lab data and should be investigated before treating mobile performance as complete. The mobile score remained high, but it does not cancel out the LCP regression. TBT is a lab proxy for responsiveness; Lighthouse does not measure field INP in this run.

`reportWebVitals` reports CLS, INP, LCP, and TTFB for actual sessions. In development it logs them and dispatches `app:web-vital` browser events so they can be observed; collect field data from deployed sessions before drawing conclusions about real users.

## Reproduce

1. Run `npm run build`.
2. Run `npm run preview -- --host 127.0.0.1`.
3. Open Chrome DevTools Lighthouse, select Mobile or Desktop and Performance, then record multiple runs.

The report values above were captured against local builds; they are not a production deployment measurement.
