require('dotenv').config();
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_URL = 'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage';

const GOIKO_URL = 'https://www.goiko.com/menu-del-dia/';
const GOIKO_LOOK_FOR = 'Hoy, la hamburguesa del día es:</p><h3><a href="https://www.goiko.com/plato/kevin-bacon';

const KEVIN_BACON_TODAY_MESSAGE = process.env.KEVIN_BACON_TODAY_MESSAGE || 'Hoy hay Kevin Bacon en el menú del día de Goiko!';

async function checkKevin() {
	// Get data
	let request;
	try {
		request = await axios.get(GOIKO_URL);
	} catch (e) {
		console.error(e);
		return null;
	}

	if (!request || !request.data) {
		console.error('Data not received');
		return null;
	}

	const pageContent = request.data;

	if (pageContent.indexOf(GOIKO_LOOK_FOR) === -1) {
		console.log('Today there is no Kevin Bacon :(');
		return null;
	}

	console.log('Today there is Kevin Bacon :)');

	// Send Telegram message
	let telegramMessage;
	try {
		telegramMessage = await axios.post(TELEGRAM_URL, {
			chat_id: TELEGRAM_CHAT_ID,
			text: KEVIN_BACON_TODAY_MESSAGE,

		});
	} catch (e) {
		console.error('Could not send Telegram message');
		return null;
	}

	console.log('Telegram message sent');
}

module.exports = checkKevin();
