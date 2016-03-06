'use strict';

function SVGEditor(nAnchor, pConfig)
{
	var pPropertyConf = {
		enumerable: false,
		configurable: false,
		writeable: false,
		value: undefined
	};

	// Container
	pPropertyConf.value = nAnchor;
	Object.defineProperty(this, 'content', pPropertyConf);

	// Style generator
	var pSheet = document.createElement('style');
	pSheet.title = this.id;
	document.head.appendChild(pSheet);
	pPropertyConf.value = pSheet.sheet;
	Object.defineProperty(this, 'sheet', pPropertyConf);

	// Init all modules
	for (var i = 0; i < this.Modules.length; i++)
	{
		this.Modules[i](this);
	}
}

/**
 * SVGEditor Modules
 * 
 * @type {Array}
 */
SVGEditor.prototype.Modules = [];

/**
 * SVGEditor Module creation. createModule expects a function to which is can suply 
 *           a reference to the currently initialising editor during editor init.
 *           
 * @type {Function}
 */
SVGEditor.createModule = SVGEditor.prototype.Modules.push.bind(SVGEditor.prototype.Modules);


