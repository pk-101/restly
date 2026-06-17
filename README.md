# ⚡ Restly - API Inspector Dashboard

Restly is a high-performance, client-side REST API client and JSON schema visualizer built with pure vanilla JavaScript. It allows developers to test CRUD endpoints, monitor actual round-trip network performance, and explore deeply nested JSON payloads through an interactive, collapsible tree hierarchy.

🔗 **Live Demo:** [Insert your GitHub Pages URL here]

---

## 🚀 Features

* **Full CRUD Testing Support:** Smooth execution pipelines for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` requests.
* **Actual Latency Metrics:** High-resolution round-trip timing tracking utilizing the browser's performance telemetry clock.
* **Recursive Token Parsing Tree:** Dynamically maps out unknown, multi-layered data structures into an expandable UI tree.
* **Quick-Load Presets:** Pre-configured public test schemas available at a single click for immediate evaluation.
* **Custom Security Headers:** Key-value parameters injecting headers like `Authorization` or custom metadata values securely.

---

## 🛠️ Technical Concepts Implemented

Building this utility required deep integration of intermediate and advanced JavaScript mechanics:

1. **Asynchronous Execution & Promises:** Utilizes `async/await` structure around the native `fetch()` API stream to handle asynchronous network cycles elegantly.
2. **Recursive DOM Tree Rendering:** Harnesses algorithmic self-calling loops to systematically crawl complex array lists or object shapes, rendering modular interface configurations programmatically.
3. **Data Transformation & Structural Mapping:** Manipulates data records securely, parsing text formats dynamically using comprehensive validation parameters.
4. **Isolated Error Enclosures:** Wraps network pipelines inside custom `try...catch` blocks to capture malformed JSON layouts or failed connectivity states gracefully without breaking runtime tasks.
5. **Dynamic DOM Interface Binding:** Listens to event triggers to adjust payload panels or performance metrics instantaneously on the fly.

---

## 📂 Project Structure

```text
restly/
│
├── index.html        # App skeleton architecture and DOM element bindings
├── style.css         # Modern developer-centric dark theme design layout
├── app.js            # Core async network clock and recursive parsing visualizer
└── README.md         # Documentation