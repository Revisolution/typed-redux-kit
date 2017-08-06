'use strict';
const FakeTimers = require('jest-util').FakeTimers;
const ModuleMocker = require('jest-mock').ModuleMocker;

function deepCopy(obj) {
	const newObj = {};
	let value;
	for (const key in obj) {
		value = obj[key];
		if (typeof value === 'object' && value !== null) {
			value = deepCopy(value);
		}
		newObj[key] = value;
	}
	return newObj;
}

// Object.assign polyfill with try/catch for each assignment expression
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
function assign(target) {
	if (target === null) {
		throw new TypeError('Cannot convert undefined or null to object');
	}

	const to = Object(target);

	for (let index = 1; index < arguments.length; index++) {
		const nextSource = arguments[index];

		if (nextSource !== null) { // Skip over if undefined or null
			for (const nextKey in nextSource) {
				// Avoid bugs when hasOwnProperty is shadowed
				if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
					try {
						to[nextKey] = nextSource[nextKey];
					}
					catch (e) {
						// Any errors are caused by trying to extend node's environment
					}
				}
			}
		}
	}
	return to;
}

class NodeDebugEnvironment {
	constructor(config) {
		// lazy require
		this.document = require('jsdom').jsdom( /* markup */undefined, {url: config.testURL });

		// jest doesn't need full global before runScript, but to reduce possible issues we create full copy here
		this.global = assign(this.document.defaultView, {
			// FIXME: Some non-enumerable properties must be Monkeypatched
			HTMLElement: this.document.defaultView.HTMLElement,
			HTMLAnchorElement: this.document.defaultView.HTMLAnchorElement
		}, global, deepCopy(config.globals));


		this.moduleMocker = new ModuleMocker(global);
		this.fakeTimers = new FakeTimers(this.global, this.moduleMocker, config);
	}

	dispose() {
		if (this.fakeTimers) {
			this.fakeTimers.dispose();
		}
		this.fakeTimers = null;
	}

	runScript(script) {

		// we cannot set global.console to new value (TypeError: Cannot set property console of #<Object> which has only a getter)
		const jestCustomConsole = this.global.console;

		if (jestCustomConsole !== null) {

			// but we can alter properties in any case
			assign(global.console, jestCustomConsole);

			// delete because later we will apply all jest changes from this.global to global
			delete this.global.console;
		}

		assign(global, this.global);

		// it seems Jest hold reference to this.global object and next line doesn't affect, so, we restore console
		this.global.console = jestCustomConsole;

		// during runInThisContext global will be modified (jasmine will set global.jasmineRequire), so, we must set this.global to global (jest will not modify global anymore, so, it is safe)
		this.global = global;

		return script.runInThisContext(this.document.documentView);
	}
}

module.exports = NodeDebugEnvironment;
