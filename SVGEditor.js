'use strict';
function SVGEditor(nAnchor, pConfig)
{
	var pPropertyConf = {
		enumerable: false,
		configurable: false,
		writeable: false,
		value: undefined
	};

	// Config
	pPropertyConf.value = pConfig;
	Object.defineProperty(this, 'config', pPropertyConf);

	// Container
	pPropertyConf.value = nAnchor;
	Object.defineProperty(this, 'content', pPropertyConf);

	// Window
	pPropertyConf.value = window;
	Object.defineProperty(this, 'window', pPropertyConf);

	// Document
	pPropertyConf.value = document;
	Object.defineProperty(this, 'document', pPropertyConf);

	// Style generator
	var pSheet = document.createElement('style');
	pSheet.title = this.id;
	document.head.appendChild(pSheet);
	pPropertyConf.value = pSheet.sheet;
	Object.defineProperty(this, 'sheet', pPropertyConf);

	// Init all modules
	SVGEditor.Modules.tree.init(this);
}


/**
 * Staticly bound SVGEditor Module registration. Modules.add expects a unique module name and a module function to which is can suply 
 * a reference to the currently initialising editor during editor init.
 *
 * @param  {String}      strNS         Defines the modules namespace. Namespaces may be '/' deliniated to define the module as a sub module (and a dependant) of 
 *                                     another parent module. Namespaces must evaluate uniquely at editor instantiation. Non deliniated namespaces
 *                                     will init relative to the current editor.
 * 
 * @param  {Object}      pConfig       Configuration for this module. Configuration options include:
 *                                     {enabled: bool||function} If false, this module will not init. If function, will be evaluated against current editor.
 *                                     {order: Number} Instantiation order in relation to sibling modules. Defaults to after all order delcarative siblings,
 *                                                     in no guaranteed order.
 *                             
 * @param  {Function}    fnModule      The function to be instantiated as the module. Always supplied with the current editor.
 * 
 * @return {Undefined}                 Void
 */
SVGEditor.Modules = {
	add: function(strNS, pConfig, fnModule)
	{
		var pModule = new SVGEditor.Modules.Module(strNS, pConfig, fnModule);
		SVGEditor.Modules.tree.insertModule(pModule);
	},
	Module: function(strNS, pConfig, fnModule)
	{
		var arrAllSubNS = strNS.split('/');
		this.moduleNS = arrAllSubNS[arrAllSubNS.length - 1];
		this.moduleAllParentSubNS = arrAllSubNS.slice(0, -1) || [];
		this.moduleParentNS = '';
		for (var i = 0; i < this.moduleAllParentSubNS.length; i++) 
		{
			this.moduleParentNS += this.moduleAllParentSubNS[i];
		}
		this.childModules = {};

		this.enabled = pConfig.enabled || pConfig.enabled !== false;
		if (!this.enabled)
		{
			return;
		}

		this.order = pConfig.order;
		this.moduleFn = fnModule;
	},
	tree: {
		moduleNS: '',
		childModules: {},
		enabled: true,
		moduleFn: function(pEditor){},
		insertModule: function(pModule)
		{
			if (this.moduleNS === pModule.moduleParentNS)
			{
				this.childModules[pModule.moduleNS] = pModule;
				return;
			}

			var pParentModule = this;
			for (var i = 0; i < pModule.moduleAllParentSubNS.length; i++) 
			{
				var strSubNS = pModule.moduleAllParentSubNS[i];
				if (!pParentModule.childModules[strSubNS])
				{
					SVGEditor.Modules.add(pParentModule.moduleNS + '/' + strSubNS, {enabled: false}, null);
				}
				pParentModule = pParentModule.childModules[strSubNS];
			}

			if (pParentModule.childModules[pModule.moduleNS])
			{
				pModule.childModules = pParentModule.childModules[pModule.moduleNS].childModules;
			}
			pParentModule.childModules[pModule.moduleNS] = pModule;

		},
		init: function(pEditor)
		{
			var fnOrderChildModules = function(a, b)
			{
				var bAUnOrdered = a.order === undefined;
				var bBUnOrdered = b.order === undefined;
				if (bAUnOrdered && bBUnOrdered)
				{
					return 0;
				}
				else if (bAUnOrdered)
				{
					return 1;
				}
				else if (bBUnOrdered)
				{
					return -1;
				}
				return a.order - b.order;
			};
			var fnRecursiveInit = function(pModule)
			{
				if (!pModule.enabled || (typeof pModule.enabled === 'function' && !pModule.enabled(pEditor)))
				{
					return;
				}

				pModule.moduleFn(pEditor);

				var arrAllChildModules = [];
				for (var strModule in pModule.childModules)
				{
					arrAllChildModules.push(pModule.childModules[strModule]);
				}
				if (!arrAllChildModules.length)
				{
					return;
				}
				arrAllChildModules.sort(fnOrderChildModules);
				for (var i = 0; i < arrAllChildModules.length; i++)
				{
					fnRecursiveInit(arrAllChildModules[i]);
				}
			};
			fnRecursiveInit(this);
		}
	}
};