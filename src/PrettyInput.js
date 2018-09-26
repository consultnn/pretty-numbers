'use strict';

const PrettyModify = {
	format(number) {
		number = number.toString();

		if (number.indexOf('.') > -1 || number.indexOf(',') > -1) {
			number = number.split(/[\.,]/);
			console.log(number);
			let entire = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			let decimal = number.length > 1 ? '.' + number[1] : '';
			return entire + decimal;
		}

		number = number.toString().replace(/ /g, "");
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	},
	unformat(number, makeFloat = false) {
		let value = number.replace(' ', '');
		return makeFloat ? parseFloat(value) : parseInt(value);
	}
};

class PrettyInput {
	constructor(element) {
		if (element == null) {
			throw new Error('PrettyNumbers: empty element');
		}

		if (element.tagName.toLowerCase() != 'input') {
			throw new Error('PrettyNumbers: element tag must be <input>');
		}

		this.__input = element;
		this.__isFloat = this.__input.dataset.float || false;
		this.__isNegative = this.__input.dataset.negative || false;
		this.__min = this.__input.dataset.min || null;
		this.__max = this.__input.dataset.max || null;

		this.__input.addEventListener('keydown', this.__onKeyDown.bind(this));
		this.__input.addEventListener('keyup', this.__onKeyUp.bind(this));
		this.__input.addEventListener('change', this.__onChange.bind(this));
		this.__input.addEventListener('focus', this.__onFocus.bind(this));
		this.__input.addEventListener('click', this.__onClick.bind(this));
	}

	get input() {
		return this.__input;
	}

	get value() {
		if (this.__input.value.toString().length > 3) {
			return PrettyModify.unformat(this.input.value, this.isFloat);
		}
		return this.input.value;
	}

	get formattedValue() {
		return this.input.value;
	}

	get isFloat() {
		return Boolean(this.__isFloat);
	}

	get isNegative() {
		return Boolean(this.__isNegative);
	}

	get min() {
		return this.__min;
	}

	get max() {
		return this.__max;
	}

	set value(newValue) {
		if (newValue.toString().length > 3) {
			this.input.value = PrettyModify.format(newValue);
		} else {
			this.input.value = newValue;
		}
	}

	set isFloat(value) {
		this.__isFloat = Boolean(value);
		this.input.dataset.float = this.isFloat;
	}

	set isNegative(value) {
		this.__isNegative = Boolean(value);
		this.input.dataset.negative = this.isNegative;
	}

	set min(value) {
		if (this.max && this.min < this.max) {
			this.__min = value;
			this.__checkRange();
		} else if (this.max && this.min >= this.max) {
			throw new Error('PrettyInput: min must be less than max');
		}
	}

	set max(value) {
		if (this.min && this.max > this.min) {
			this.__min = value;
			this.__checkRange();
		} else if (this.min && this.max <= this.min) {
			throw new Error('PrettyInput: max must be more than min');
		}
	}

	__onKeyDown(e) {
		let keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
		const allowedKeys = [8, 9, 35, 36, 46]; //Backspace, Tab, Home, End, Del

		const isLeft = e.keyCode == 37;
		const isRight = e.keyCode == 39;
		const isBackspace = e.keyCode == 8;
		const isDel = e.keyCode == 46;
		const formattedValue = this.formattedValue;
		const cursorPosition = e.currentTarget.selectionStart;

		if (isLeft || isRight) { // Left, Right
			let cursorShift = 0;
			e.preventDefault();

			if (cursorPosition > 0 && isLeft) {
				cursorShift--;
				if (cursorPosition > 0 && formattedValue.charAt(cursorPosition - 1) == ' ') {
					cursorShift--;
				}
			} else if (cursorPosition <= formattedValue.length && isRight) {
				cursorShift++;
				if (formattedValue.charAt(cursorPosition + 1) == ' ') {
					cursorShift++;
				}
			}

			if (cursorShift != 0) {
				this.input.setSelectionRange(cursorPosition + cursorShift, cursorPosition + cursorShift);
				return;
			}
		}

		if (isBackspace && formattedValue.charAt(cursorPosition - 1) == ' ') {
			this.input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
			return;
		}

		if (isDel && formattedValue.charAt(cursorPosition) == ' ') {
			this.input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
			return;
		}

		if (allowedKeys.indexOf(e.keyCode) > -1) {
			return;
		}

		if (this.isFloat) {
			keys.push('.', ',');

			if ((e.key == '.' || e.key == ',') && this.formattedValue.indexOf('.') > -1) {
				e.preventDefault();
				return;
			}
		}

		if (this.isNegative) {
			keys.push('-');

			if (e.key == '-' && this.formattedValue.indexOf('-') > -1 && this.formattedValue.length > 0) {
				e.preventDefault();
				return;
			}
		}

		if (!keys.includes(e.key)) {
			e.preventDefault();
		}
	}

	__onKeyUp(e) {
		const oldFormattedValue = this.formattedValue;
		const cursorPosition = e.currentTarget.selectionStart;
		this.input.value = PrettyModify.format(this.input.value);
		const newFormattedValue = this.formattedValue;

		const isBackspace = e.keyCode == 8;
		const isDel = e.keyCode == 46;
		const diffFormattedLength = oldFormattedValue.length - newFormattedValue.length;

		if (isBackspace) {
			this.input.setSelectionRange(cursorPosition + diffFormattedLength, cursorPosition + diffFormattedLength);
		}

		if (isDel) {
			this.input.setSelectionRange(cursorPosition, cursorPosition);
		}
	}

	__checkRange() {
		let value = this.value;
		if (this.min && value < this.min) {
			this.value = this.min;
		}

		if (this.max && value > this.max) {
			this.value = this.max;
		}
	}

	__onChange() {
		this.__checkRange();
	}

	__onFocus() {
		this.input.setSelectionRange(-1, -1);
	}

	__onClick() {
		const cursorPosition = this.input.selectionStart;

		if (this.formattedValue.charAt(cursorPosition) == ' ') {
			this.input.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
		}
	}
}