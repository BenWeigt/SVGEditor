'use strict';
SVGEditor.Modules.add('CSSClass', {order: 9}, function(pEditor)
{
	pEditor.CSSClass = {
		newClass: function(pParentClass)
		{
			return new CSSClass(pParentClass);
		},

		newSelector: function(strSelector)
		{
			return new CSSSelector(strSelector);
		}
	};

	function CSSClass(pParentClass)
	{
		var pPropertyConf = {
			enumerable: false,
			configurable: false,
			writeable: false,
			value: undefined
		};
		// ID & Container
		pPropertyConf.value = pParentClass._nextSubClass();
		Object.defineProperty(this, 'className', pPropertyConf);

		pPropertyConf.value = alphaUniqueClassGenerator(this.className);
		Object.defineProperty(this, '_nextSubClass', pPropertyConf);

		this.rules = {};

		this.s = '.'+this.className;
		this.S = ' .'+this.className;
		this.h = this.s+':hover';
		this.H = this.S+':hover';
	}

	CSSClass.prototype.applyClassTo = function(nElement) 
	{
		nElement._CSSClassList = nElement._CSSClassList || {};
		nElement._CSSClassList[this.className] = this;
		nElement.classList.add(this.className);
	};

	CSSClass.prototype.removeClassFrom = function(nElement)
	{
		if (nElement._CSSClassList && nElement._CSSClassList[this.className])
		{
			delete nElement._CSSClassList[this.className];
		}
		nElement.classList.remove(this.className);
	};



	function CSSSelector(strSelector)
	{
		var pPropertyConf = {
			enumerable: false,
			configurable: false,
			writeable: false,
			value: undefined
		};
		// Selector
		pPropertyConf.value = strSelector;
		Object.defineProperty(this, 'selector', pPropertyConf);

		this.rules = {};
	}

	CSSSelector.prototype.setRules = function(pRules)
	{
		for (var strKey in pRules)
		{
			this.rules[strKey] = pRules[strKey];
		}
		this._writeToStyles();
		return this;
	};

	CSSSelector.prototype._writeToStyles = function()
	{
		if (this.currentSheetId !== undefined)
		{
			pEditor.sheet.deleteRule(this.currentSheetId);
		}
		this.currentRule = this.selector + '{';
		for (var strKey in this.rules)
		{
			if (this.rules[strKey].length)
			{
				this.currentRule += strKey + ':' + this.rules[strKey] + ';';
			}
		}
		this.currentRule += '}';
		this.currentSheetId = pEditor.sheet.insertRule(this.currentRule, pEditor.sheet.cssRules.length);
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
	m_pEditorCSSClass.applyClassTo(pEditor.content);
	pEditor.CSSClass.root = m_pEditorCSSClass;
});