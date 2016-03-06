'use strict';

SVGEditor.createModule(function(pEditor)
{
	pEditor.CSSClass = {
		newClass: function()
		{

		},







	};


	function CSSClass(pParent)
	{
		var pPropertyConf = {
			enumerable: false,
			configurable: false,
			writeable: false,
			value: undefined
		};
		// ID & Container
		pPropertyConf.value = pParent._nextSubClass();
		Object.defineProperty(this, 'className', pPropertyConf);

		pPropertyConf.value = alphaUniqueClassGenerator(this.className);
		Object.defineProperty(this, '_nextSubClass', pPropertyConf);
	}

	CSSClass.prototype.assignClassTo = function(nElement) 
	{
		nElement._CSSClass = this;
		nElement.classList.add(this.className);
	};


	/**
	 * Unique Alpha-Hexavigesimal ID generator.
	 * 
	 * @yield {Object} A new generator whos .next().value will be a alpha-hexavigesimal 
	 *                 string unique to that generator.
	 */
	function* _alphaUniqueGenerator()
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
	}

	/**
	 * Wraps a new _alphaUniqueGenerator instance and returns it. The wrapper 
	 * conveniently iterates the generator, returning the value.
	 * 
	 * @return {Function} Wrapper function containing a new _alphaUniqueGenerator
	 */
	function alphaUniqueClassGenerator(strPre)
	{
		if (strPre)
		{
			strPre += '-';
		}
		else
		{
			strPre = '';
		}
		return function()
		{
			return strPre + this.next().value;
		}.bind(_alphaUniqueGenerator());
	}

	if (!SVGEditor.hasOwnProperty('_nextSubClass'))
	{
		SVGEditor._nextSubClass = alphaUniqueClassGenerator();
	}
	var m_pEditorCSSClass = new CSSClass(SVGEditor);
	m_pEditorCSSClass.assignClassTo(pEditor.content);

});