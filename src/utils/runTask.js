export const runTask = (fn, options = {}) => {
	if (globalThis.scheduler?.postTask) {
		return scheduler.postTask(fn, options);
	}

	// Fall back to yielding with setTimeout or requestAnimationFrame.
	const delay = options.delay || 0;
	const priority = options.priority || "user-visible";

	return new Promise((resolve) => {
		const execute = () => resolve(fn());

		if (delay > 0) {
			setTimeout(execute, delay);
		} else if (priority === "background") {
			if (typeof window.requestIdleCallback === "function") {
				window.requestIdleCallback(execute);
			} else {
				setTimeout(execute, 1);
			}
		} else {
			requestAnimationFrame(execute);
		}
	});
};
