import { getCounter, updateCounter } from "./db.js";

const POLL_INTERVAL = 500; // Check for updates every 500ms

let currentCounterValue = 0;
let pollIntervalId: NodeJS.Timeout | null = null;

function isNumber(value: any): value is number {
    return typeof value === 'number';
}

export function updateDisplay(counterDisplay: HTMLParagraphElement | null, value: number) {
    if (counterDisplay && counterDisplay.textContent !== value.toString()) {
        // Smooth fade animation for UI update
        counterDisplay.style.opacity = '0.6';
        counterDisplay.textContent = value.toString();
        setTimeout(() => {
            counterDisplay.style.opacity = '1';
        }, 150);
    }
}

export async function initCounter(counterDisplay: HTMLParagraphElement | null) {
    console.log("Initializing counter...");
    const current = await getCounter();
    // Using type check for safety
    currentCounterValue = isNumber(current) ? current : 0;
    updateDisplay(counterDisplay, currentCounterValue);
}

export function setupButtonListener(
    counterBtn: HTMLButtonElement | null,
    counterDisplay: HTMLParagraphElement | null
) {
    if (counterBtn) {
        counterBtn.addEventListener('click', async () => {
            console.log("Button clicked!");
            counterBtn.disabled = true;

            try {
                const newValue = await updateCounter();
                // Ensure the returned value is a number before assignment
                if (isNumber(newValue)) {
                    currentCounterValue = newValue;
                    updateDisplay(counterDisplay, currentCounterValue);
                }
            } catch (error) {
                console.error("Failed to update counter:", error);
            } finally {
                counterBtn.disabled = false;
            }
        });
    }
}

export async function startRealTimePolling(counterDisplay: HTMLParagraphElement | null) {
    // Prevent multiple intervals from running at once
    if (pollIntervalId) return;

    pollIntervalId = setInterval(async () => {
        try {
            const latestValue = await getCounter();
            // Compare and update only if it's a valid number and has changed
            if (isNumber(latestValue) && latestValue !== currentCounterValue) {
                console.log(`Counter updated from ${currentCounterValue} to ${latestValue}`);
                currentCounterValue = latestValue;
                updateDisplay(counterDisplay, currentCounterValue);
            }
        } catch (error) {
            console.error("Error polling for updates:", error);
        }
    }, POLL_INTERVAL);
}

export function stopRealTimePolling() {
    if (pollIntervalId !== null) {
        clearInterval(pollIntervalId);
        pollIntervalId = null;
    }
}
