'use strict';
SVGEditor.Modules.add('Commands', {}, function(pEditor)
{

	pEditor.activeDraw = null;
	pEditor.layers = [];
	pEditor.Commands = {
		setFillColor: function()
		{

		},

		setStrokeColor: function(strColor)
		{

		},



		m: function(){
			if (!pEditor.activeDraw)
			{
				pEditor.activeDraw = pEditor.Canvas.Draw.newPath(pEditor.activePoint);
			}
			else
			{
				pEditor.activeDraw.m(pEditor.activePoint);
			}
		},
		h: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.h(pEditor.activePoint);
		},
		v: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.v(pEditor.activePoint);
		},
		l: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.l(pEditor.activePoint);
		},
		z: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.z();
		},

		selectLayer: function(iLayer)
		{
			if (pEditor.activeDraw)
			{
				pEditor.Commands.end();
			}
			pEditor.activeDraw = pEditor.layers[iLayer] || null;
		},

		delLast: function()
		{
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.delLast();
			if (!pEditor.activeDraw.points.length)
			{
				pEditor.Commands.remove();
			}
		},

		remove: function()
		{
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.remove();
			var iIndex = pEditor.layers.indexOf(pEditor.activeDraw);
			if (iIndex >= 0)
			{
				pEditor.layers.splice(iIndex, 1);
			}
			pEditor.activeDraw = null;
		},

		end: function()
		{
			if (!pEditor.activeDraw)
			{
				return;
			}
			var iIndex = pEditor.layers.indexOf(pEditor.activeDraw);
			if (iIndex == -1)
			{
				pEditor.layers.push(pEditor.activeDraw);
			}
			pEditor.activeDraw = null;
		},

		M: function(){
			if (!pEditor.activeDraw)
			{
				pEditor.activeDraw = pEditor.Canvas.Draw.newPath(pEditor.activePoint);
			}
			else
			{
				pEditor.activeDraw.M(pEditor.activePoint);
			}
		},
		H: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.H(pEditor.activePoint);
		},
		V: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.V(pEditor.activePoint);
		},
		L: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.L(pEditor.activePoint);
		},
		Z: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.Z(pEditor.activePoint);
		},
	};

	pEditor.document.addEventListener('keypress', function(evt){
		var iCode = evt.keyCode || evt.which;
		var strKey = String.fromCharCode(iCode);
		if (pEditor.activePoint && pEditor.Commands[strKey])
		{
			pEditor.Commands[strKey]();
		}
		else if (parseInt(strKey, 10) > 0)
		{
			pEditor.Commands.selectLayer(parseInt(strKey, 10) - 1);
		}
		evt.preventDefault();
	}, true);
	pEditor.document.addEventListener('keydown', function(evt){
		var iCode = evt.keyCode || evt.which;
		if (iCode === 8 || iCode === 46)
		{
			evt.preventDefault();
			pEditor.Commands.delLast();
		}
		else if (iCode === 27)
		{
			evt.preventDefault();
			pEditor.Commands.end();
		}
	});
});