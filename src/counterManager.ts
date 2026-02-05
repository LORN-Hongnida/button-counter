import { getCounter, updateCounter } from "./db.js";

const POLL_INTERVAL = 500; // Check for updates every 500ms

let currentCounterValue = 0;
let pollTimeoutId: NodeJS.Timeout | null = null;
let isPolling = false;

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
    // Prevent multiple polling sessions from running at once
    if (isPolling) return;
    
    isPolling = true;

    const pollOnce = async () => {
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

        // Schedule the next poll
        if (isPolling) {
            pollTimeoutId = setTimeout(pollOnce, POLL_INTERVAL);
        }
    };

    // Start the first poll
    pollTimeoutId = setTimeout(pollOnce, POLL_INTERVAL);
}

export function stopRealTimePolling() {
    isPolling = false;
    if (pollTimeoutId !== null) {
        clearTimeout(pollTimeoutId);
        pollTimeoutId = null;
    }
}
