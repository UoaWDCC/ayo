const MODAL_OPEN_EVENT = 'ayo:modal-open'

/** Lets any modal/panel announce that it just opened, so surfaces like the mobile nav
 * (which live outside the modal tree, in NavBar) can close themselves to avoid overlapping it. */
export function announceModalOpen() {
  window.dispatchEvent(new Event(MODAL_OPEN_EVENT))
}

export function onModalOpen(handler: () => void) {
  window.addEventListener(MODAL_OPEN_EVENT, handler)
  return () => window.removeEventListener(MODAL_OPEN_EVENT, handler)
}
