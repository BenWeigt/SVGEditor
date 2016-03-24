'use strict';
SVGEditor.Modules.add('TextOut', {}, function(pEditor)
{

	// Static access binding
	pEditor.TextOut = {

	};

	if (pEditor.config.textOut)
	{
		pEditor.TextOut.target = pEditor.document.getElementById(pEditor.config.textOut);
		pEditor.TextOut.gui = true;
	}
	else
	{
		pEditor.TextOut.target = console.log;
		pEditor.TextOut.gui = false;
	}





	pEditor.Canvas.CanvasOverlay.svg.addEventListener('click', function(evt){
		if (pEditor.currentPoint)
		{
			console.log(pEditor.currentPoint.pos);
		}
	});


	var m_pData = {
		mousePos: null,
		currentDraw: {
			type: null,
			path: null
		},
		svgOut: null
	};

	function _updateWriteout()
	{
		var pData = {
			mousePos: pEditor.activePoint,
			currentDraw: {
				type: pEditor.activeDraw ? pEditor.activeDraw.type : null,
				path: pEditor.activeDraw ? pEditor.activeDraw.getPath() : null
			},
			svgOut: pEditor.Canvas.svg.outerHTML
		};

		if (m_pData.mousePos !== pData.mousePos ||
			  m_pData.svgOut !== pData.svgOut ||
			  m_pData.currentDraw.path !== pData.currentDraw.path ||
			  m_pData.currentDraw.type !== pData.currentDraw.type)
		{

			m_pData = pData;
			return true;
		}
		
		return false;
	}

	function _renderGUI()
	{
		if (!_updateWriteout())
		{
			return;
		}

		while (pEditor.TextOut.target.firstChild) {
			pEditor.TextOut.target.removeChild(pEditor.TextOut.target.firstChild);
		}

		var nMousePosL = pEditor.ElementConstructor.newElement('span', {}, 'Mouse Pos: ');
		var nMousePosV = pEditor.ElementConstructor.newElement('span', {}, m_pData.mousePos? (m_pData.mousePos.pos.x + ':' + m_pData.mousePos.pos.y) : '_:_');
		nMousePosL.appendChild(nMousePosV);
		pEditor.TextOut.target.appendChild(nMousePosL);

		pEditor.TextOut.target.appendChild(pEditor.ElementConstructor.newElement('br', {}));

		if (m_pData.currentDraw.type)
		{
			var nDrawL = pEditor.ElementConstructor.newElement('span', {}, m_pData.currentDraw.type+': ');
			var nDrawV = pEditor.ElementConstructor.newElement('span', {}, m_pData.currentDraw.path);
			nDrawL.appendChild(nDrawV);
			pEditor.TextOut.target.appendChild(nDrawL);
		}

		if (m_pData.svgOut)
		{
			var nFinalOut = pEditor.ElementConstructor.newElement('p', {});
			nFinalOut.innerText = m_pData.svgOut;
			pEditor.TextOut.target.appendChild(nFinalOut);
		}
	}

	function _renderConsole()
	{
		if (!_updateWriteout())
		{
			return;
		}

		if (console.clear)
		{
			console.clear();
		}
		else
		{
			console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
		}

		console.log('Mouse Pos: ' + m_pData.mousePos.pos.x + ':' + m_pData.mousePos.pos.y);
	}

	var m_fnRender = pEditor.TextOut.gui ? _renderGUI : _renderConsole;

	pEditor.Animate.animate(function(){
		m_fnRender();
	});



});