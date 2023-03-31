const display = document.getElementById('display');
let result = '';

function addToDisplay(value) {
	result += value;
	display.innerHTML = result;
}

function clearDisplay() {
	result = '';
	display.innerHTML = result;
}

function calculate() {
	result = eval(result);
	display.innerHTML = result;
}
