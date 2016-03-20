'use strict';
SVGEditor.Modules.add('Commands', {}, function(pEditor)
{

	pEditor.activeDraw = null;
	pEditor.Commands = {
		M: function(){
			pEditor.Commands.m();
		},
		H: function(){
			pEditor.Commands.H();
		},
		V: function(){
			pEditor.Commands.v();
		},
		L: function(){
			pEditor.Commands.l();
		},
		Z: function(){
			pEditor.Commands.z();
		},

		m: function(){
			if (pEditor.activeDraw)
			{
				// finish old
				return;
			}
			pEditor.activeDraw = pEditor.Canvas.Draw.newPath(pEditor.activePoint.pos.x, pEditor.activePoint.pos.y);
		},
		h: function(){
			if (!pEditor.activeDraw)
			{
				// cant path without open line
				return;
			}
			pEditor.activeDraw.h(pEditor.activePoint.pos.x);
		},
		v: function(){
			if (!pEditor.activeDraw)
			{
				// cant path without open line
				return;
			}
			pEditor.activeDraw.v(pEditor.activePoint.pos.y);
		},
		l: function(){
			if (!pEditor.activeDraw)
			{
				// cant path without open line
				return;
			}
			pEditor.activeDraw.l(pEditor.activePoint.pos.x, pEditor.activePoint.pos.y);
		},
		z: function(){
			if (!pEditor.activeDraw)
			{
				// cant path without open line
				return;
			}
			pEditor.activeDraw.z();
			pEditor.activeDraw = null;
		}
	};

	pEditor.document.addEventListener('keypress', function(evt){
		var strKey = String.fromCharCode(evt.keyCode || evt.which);
		if (pEditor.activePoint && pEditor.Commands[strKey])
		{
			pEditor.Commands[strKey]();
		}
	}, true);
});