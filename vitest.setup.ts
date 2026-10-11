// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// jsdom has no ResizeObserver, which FakeScrollbar (used inside our modals) relies on.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
