'use strict';
SVGEditor.Modules.add('Canvas/CanvasOverlay', {}, function(pEditor)
{
	/**
	 * Set up CanvasOverlay overlay
	 */
	var m_iPadding = 10;

	// Css classes
	var m_css = {};
	m_css.svg = pEditor.CSSClass.newClass(pEditor.CSSClass.root);
	m_css.pix = pEditor.CSSClass.newClass(m_css.svg);
	m_css.pixA = pEditor.CSSClass.newClass(m_css.svg);

	var m_nSVGCanvas = pEditor.ElementConstructor.newElementSVG('svg', {
		width: pEditor.Canvas.drawHeight + (m_iPadding * 2),
		height: pEditor.Canvas.drawWidth + (m_iPadding * 2),
		viewBox: '0 0 ' + (pEditor.Canvas.drawHeight + (m_iPadding * 2)) + ' ' + (pEditor.Canvas.drawWidth + (m_iPadding * 2)),
	});

	pEditor.content.appendChild(m_nSVGCanvas);
	pEditor.Canvas.CanvasOverlay = {};
	pEditor.Canvas.CanvasOverlay.svg = m_nSVGCanvas;

	m_css.svg.applyClassTo(m_nSVGCanvas);
	

	/**
	 * Mouse Track
	 */
	pEditor.activePoint = null;
	var m_iOffsetX = 0;
	var m_iOffsetY = 0;
	pEditor.Canvas.CanvasOverlay.mouseIsOver = false;
	m_nSVGCanvas.addEventListener('mousemove', function(evt){
		m_iOffsetX = evt.offsetX;
		m_iOffsetY = evt.offsetY;
	});
	m_nSVGCanvas.addEventListener('mouseleave', function(evt){
		pEditor.Canvas.CanvasOverlay.mouseIsOver = false;
	});
	m_nSVGCanvas.addEventListener('mouseenter', function(evt){
		pEditor.Canvas.CanvasOverlay.mouseIsOver = true;
	});

	/**
	 * Pixels
	 */
	function Pixel(x, y, svg, posX, posY)
	{
		this.dot = pEditor.ElementConstructor.newElementSVG('circle', {
			cx: x,
			cy: y
		});
		svg.appendChild(this.dot);
		m_css.pix.applyClassTo(this.dot);
		this.x = x;
		this.y = y;
		this.pos = {
			x: posX,
			y: posY
		};
	}

	var m_arrPixelMatrix = [];
	var m_xStep = pEditor.Canvas.drawWidth / pEditor.Canvas.width;
	var m_yStep = pEditor.Canvas.drawHeight / pEditor.Canvas.height;
	var m_arrColCss = [];
	var m_arrColACss = [];
	var m_arrRowCss = [];
	var m_arrRowACss = [];

	for (var x = m_iPadding; x <= (pEditor.Canvas.drawWidth + m_iPadding); x += m_xStep)
	{
		var pCol = pEditor.CSSClass.newClass(m_css.svg);
		m_arrColCss.push(pCol);
		var pColA = pEditor.CSSClass.newClass(pEditor.CSSClass.root);
		m_arrColACss.push(pColA);
		pEditor.CSSClass.newSelector(m_css.svg.s + pColA.s + m_css.pix.S + pCol.s).setRules({
			fill: '#555 !important'
		});
	}

	for (x = m_iPadding; x <= (pEditor.Canvas.drawHeight + m_iPadding); x += m_yStep) 
	{
		var pRow = pEditor.CSSClass.newClass(m_css.svg);
		m_arrRowCss.push(pRow);
		var pRowA = pEditor.CSSClass.newClass(pEditor.CSSClass.root);
		m_arrRowACss.push(pRowA);
		pEditor.CSSClass.newSelector(m_css.svg.s + pRowA.s + m_css.pix.S + pRow.s).setRules({
			fill: '#555 !important'
		});
	}

	for (x = m_iPadding; x <= (pEditor.Canvas.drawWidth + m_iPadding); x += m_xStep)
	{
		var col = [];
		m_arrPixelMatrix.push(col);
		for (var y = m_iPadding; y <= (pEditor.Canvas.drawHeight + m_iPadding); y += m_yStep)
		{
			var nPixel = new Pixel(x, y, m_nSVGCanvas, (m_arrPixelMatrix.length - 1), col.length);
			m_arrColCss[(m_arrPixelMatrix.length - 1)].applyClassTo(nPixel.dot);
			m_arrRowCss[col.length].applyClassTo(nPixel.dot);
			col.push(nPixel);
		}
	}


	/**
	 * Animate pointer
	 */
	pEditor.Animate.animate(function(){
		if (pEditor.Canvas.CanvasOverlay.mouseIsOver)
		{
			var nActivePix = getClosestPixel();
			if (pEditor.activePoint !== nActivePix)
			{
				if (pEditor.activePoint)
				{
					m_css.pixA.removeClassFrom(pEditor.activePoint.dot);
					m_arrColACss[pEditor.activePoint.pos.x].removeClassFrom(m_nSVGCanvas);
					m_arrRowACss[pEditor.activePoint.pos.y].removeClassFrom(m_nSVGCanvas);
				}
				m_css.pixA.applyClassTo(nActivePix.dot);
				m_arrColACss[nActivePix.pos.x].applyClassTo(m_nSVGCanvas);
				m_arrRowACss[nActivePix.pos.y].applyClassTo(m_nSVGCanvas);
				pEditor.activePoint = nActivePix;
			}
		}
		else
		{
			// Clear
			if (pEditor.activePoint)
			{
				m_css.pixA.removeClassFrom(pEditor.activePoint.dot);
				m_arrColACss[pEditor.activePoint.pos.x].removeClassFrom(m_nSVGCanvas);
				m_arrRowACss[pEditor.activePoint.pos.y].removeClassFrom(m_nSVGCanvas);
				pEditor.activePoint = null;
			}
		}
	});


	function getClosestPixel()
	{
		var x = Math.min(Math.max(Math.floor(((m_iOffsetX - m_iPadding) + (m_xStep / 2)) / m_xStep), 0), m_arrPixelMatrix.length - 1);
		var y = Math.min(Math.max(Math.floor(((m_iOffsetY - m_iPadding) + (m_yStep / 2)) / m_yStep), 0), m_arrPixelMatrix[0].length - 1);
		return m_arrPixelMatrix[x][y];
	}


	// Css Styles
	pEditor.CSSClass.newSelector(m_css.svg.s).setRules({
		position: 'absolute',
		left: '0px',
		top: '0px',
		fill: 'none'
	});

	pEditor.CSSClass.newSelector(pEditor.CSSClass.root.s).setRules({
		padding: m_iPadding + 'px',
		position: 'relative',
		'box-sizing': 'border-box',
		width: pEditor.Canvas.drawHeight + (m_iPadding * 2) + 'px',
		height: pEditor.Canvas.drawWidth + (m_iPadding * 2) + 'px'
	});

	pEditor.CSSClass.newSelector(m_css.pix.s).setRules({
		// transition: 'all 50ms linear',
		fill: 'rgba(255,255,255,0.1)',
		r: '1px'
	});

	pEditor.CSSClass.newSelector(m_css.pix.s + m_css.pixA.s).setRules({
		fill: '#555',
		r: '2px'
	});
});