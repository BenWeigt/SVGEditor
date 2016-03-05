'use strict';

function SVGEditor(nAnchor, pConfig)
{
	var pPropertyConf = {
		enumerable: false,
		configurable: false,
		writeable: false,
		value: undefined
	};
	// ID & Container
	pPropertyConf.value = 'SVGEditor-' + SVGEditor.generateEditorId();
	Object.defineProperty(this, 'id', pPropertyConf);
	
	pPropertyConf.value = nAnchor;
	Object.defineProperty(this, 'content', pPropertyConf);

	this.content.classList.add(this.id);

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
		console.log('added');
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


/**
 * Unique Alpha-Hexavigesimal ID generator.
 * 
 * @yield {Object} A new generator whos .next().value will be a alpha-hexavigesimal 
 *                 string unique to that generator.
 */
SVGEditor.prototype._alphaUniqueIdGenerator = function* alphaUniqueIdGenerator()
{
	var strLang = 'abcdefghijklmnopqrstuvwxyz';
	var iIndex = 0;
	while (true)
	{
		var strUID = '';
		var i = iIndex++;
		var j;
		do
		{
			j = i%26;
			strUID = strLang.charAt(j) + strUID;
		}
		while ((i = (i-j)/26) !== 0);
		yield strUID;
	}
};

/**
 * Wraps a new alphaUniqueIdGenerator instance and returns it. The wrapper 
 * conveniently iterates the generator, returning the value.
 * 
 * @return {Function} Wrapper function containing a new alphaUniqueIdGenerator
 */
SVGEditor.prototype.getAlphaUniqueIdGenerator = function()
{
	return function()
	{
		return this.next().value;
	}.bind(this._alphaUniqueIdGenerator());
};

/**
 * Unique ID generator for SVGEditor instances. Called by SVGEditor during instantiation.
 * 
 * @type {Function}
 */
SVGEditor.generateEditorId = SVGEditor.prototype.getAlphaUniqueIdGenerator();