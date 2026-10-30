import { onCLS, onINP, onLCP, onTTFB, type Metric } from "web-vitals"

function publishMetric(metric: Metric) {
  window.dispatchEvent(new CustomEvent("app:web-vital", { detail: metric }))

  if (import.meta.env.DEV) {
    console.info(`[Web Vital] ${metric.name}`, {
      value: metric.value,
      rating: metric.rating,
    })
  }
}

export function reportWebVitals() {
  onCLS(publishMetric)
  onINP(publishMetric)
  onLCP(publishMetric)
  onTTFB(publishMetric)
}
