class DateService {
	constructor() {
		console.log('EmailService constructor');
	}

	async parseDateString(dateString) {
        const date = new Date(dateString);
        return date;
	}

	async getMonthText(date) {
		try {
			// Ensure the input is a valid date
			const parsedDate = new Date(date);
			if (isNaN(parsedDate)) {
			  throw new Error('Invalid date');
			}
		
			// Format the date to get the month name
			const monthText = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(parsedDate);
		
			return monthText;
		  } catch (error) {
			console.error('Error in getMonthText:', error.message);
		  }
	}

	async getDateText(date) {
		try {
			// Ensure the input is a valid date
			const parsedDate = new Date(date);
			if (isNaN(parsedDate)) {
			  throw new Error('Invalid date');
			}
		
			// Extract the day number
			const dayNumber = parsedDate.getDate();

			const formattedDay = dayNumber < 10 ? `0${dayNumber}` : dayNumber;

    		return formattedDay.toString(); // Convert to string if needed		
		  } catch (error) {
			console.error('Error in getDateText:', error.message);
			throw error;
		  }
	}



}

const service = new DateService();
export default service;
