import {initCounter, setupButtonListener, startRealTimePolling, stopRealTimePolling } from "./counterManager.js";

const counterBtn = document.getElementById('counter-btn') as HTMLButtonElement;
const counterDisplay = document.getElementById('counter-value') as HTMLParagraphElement;

// Pause polling when page is hidden, resume when visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopRealTimePolling();
    } else {
        startRealTimePolling(counterDisplay);
    }
});

// Initialize the app
async function initApp() {
    await initCounter(counterDisplay);
    setupButtonListener(counterBtn, counterDisplay);
    startRealTimePolling(counterDisplay);
}

initApp();