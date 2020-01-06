const saveOptions = () => {
	var api_key = document.getElementById('api_key').value;

	chrome.storage.sync.set({
		api_key: api_key
	}, () => {
		var status = document.getElementById('status');
		status.textContent = 'Opções salvas!';

		setTimeout( () => {
			status.textContent = '';
		}, 1000);
	});
}

const restoreOptions = () => {
	chrome.storage.sync.get({
		api_key: '',
	}, (items) => {
		document.getElementById('api_key').value = items.api_key;
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);