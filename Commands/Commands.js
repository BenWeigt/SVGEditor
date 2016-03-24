'use strict';
SVGEditor.Modules.add('Commands', {}, function(pEditor)
{

	pEditor.activeDraw = null;
	pEditor.layers = [];
	pEditor.Commands = {
		setFillColor: function(strColor)
		{
			if (pEditor.activeDraw)
			try
			{
				pEditor.activeDraw.node.setAttributeNS(null, 'fill', strColor);
			}
			catch(e)
			{}
		},

		setStrokeColor: function(strColor)
		{
			if (pEditor.activeDraw)
			try
			{
				pEditor.activeDraw.node.setAttributeNS(null, 'stroke', strColor);
			}
			catch(e)
			{}
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
		q: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.q(pEditor.activePoint);
		},
		z: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.z(pEditor.activePoint);
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
		Q: function(){
			if (!pEditor.activeDraw)
			{
				return;
			}
			pEditor.activeDraw.Q(pEditor.activePoint);
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
		var strNodeName = evt.target.nodeName.toLowerCase();
		var bFocusedInput = ((strNodeName === 'input' && evt.target.type === 'text') || strNodeName === 'textarea');
		if (!bFocusedInput)
		{
			if (pEditor.activePoint && pEditor.Commands[strKey])
			{
				pEditor.Commands[strKey]();
			}
			else if (parseInt(strKey, 10) > 0)
			{
				pEditor.Commands.selectLayer(parseInt(strKey, 10) - 1);
			}
		}
	}, true);
	pEditor.document.addEventListener('keydown', function(evt){
		var iCode = evt.keyCode || evt.which;
		var strNodeName = evt.target.nodeName.toLowerCase();
		var bFocusedInput = ((strNodeName === 'input' && evt.target.type === 'text') || strNodeName === 'textarea');
		
		if (!bFocusedInput)
		{
			if (iCode === 8 || iCode === 46)
			{
				pEditor.Commands.delLast();
			}
			else if (iCode === 27)
			{
				pEditor.Commands.end();
			}
			if (iCode === 8)
			{
				evt.preventDefault();
			}	
		}
	});
});