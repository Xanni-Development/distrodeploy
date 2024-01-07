const SetAsyncInterval = (callback: () => Promise<void>, delay: number) => {
	setTimeout(() => {
		callback().then(() => SetAsyncInterval(callback, delay))
	}, delay)
}

export default SetAsyncInterval
