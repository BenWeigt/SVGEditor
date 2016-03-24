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
	m_css.pixH = pEditor.CSSClass.newClass(m_css.svg);

	m_css.vecP = pEditor.CSSClass.newClass(m_css.svg);
	m_css.vecC = pEditor.CSSClass.newClass(m_css.svg);	

	var m_nSVGCanvas = pEditor.ElementConstructor.newElementSVG('svg', {
		width: pEditor.Canvas.drawHeight + (m_iPadding * 2),
		height: pEditor.Canvas.drawWidth + (m_iPadding * 2),
		viewBox: '0 0 ' + (pEditor.Canvas.drawHeight + (m_iPadding * 2)) + ' ' + (pEditor.Canvas.drawWidth + (m_iPadding * 2)),
	});

	var m_bWireframe = pEditor.config.wireframe;
	pEditor.content.appendChild(m_nSVGCanvas);
	pEditor.Canvas.CanvasOverlay = {
		svg: m_nSVGCanvas,

		getPoint: function(x, y)
		{
			if (m_arrPointMatrix[x] && m_arrPointMatrix[x][y])
			{
				return m_arrPointMatrix[x][y];
			}
			return null;
		},

		enableWireframe: function()
		{
			m_bWireframe = true;
		},

		disableWireframe: function()
		{
			m_bWireframe = false;
		}
	};

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
	 * Points
	 */
	function Point(x, y, svg, posX, posY)
	{
		this.dot = pEditor.ElementConstructor.newElementSVG('circle', {
			cx: x,
			cy: y
		});
		this.svg = svg;
		this.svg.appendChild(this.dot);
		m_css.pix.applyClassTo(this.dot);
		this.x = x;
		this.y = y;
		this.pos = {
			x: posX,
			y: posY
		};
		this.vecedPoints = [];
		this.vecToPoints = [];

		this.vecToCursor = null;
	}

	Point.prototype.vectorToPoint = function(pPoint)
	{
		var iIndex = this.vecedPoints.indexOf(pPoint);
		if (iIndex == -1)
		{
			var nVector = pEditor.ElementConstructor.newElementSVG('line', {
				x1: this.x,
				y1: this.y,
				x2: pPoint.x,
				y2: pPoint.y
			});
			this.vecedPoints.push(pPoint);
			this.vecToPoints.push(nVector);
			pPoint.vecedPoints.push(this);
			pPoint.vecToPoints.push(nVector);

			this.svg.appendChild(nVector);
			m_css.vecP.applyClassTo(nVector);
			return;
		}
	};

	Point.prototype.vectorToCursor = function(pPoint)
	{
		if (!this.vecToCursor)
		{
			this.vecToCursor = pEditor.ElementConstructor.newElementSVG('line', {
				x1: this.x,
				y1: this.y,
				x2: pPoint.x,
				y2: pPoint.y
			});
			this.svg.appendChild(this.vecToCursor);
			m_css.vecC.applyClassTo(this.vecToCursor);
			return;
		}
		this.vecToCursor.setAttributeNS(null, 'x2', pPoint.x);
		this.vecToCursor.setAttributeNS(null, 'y2', pPoint.y);
	};

	Point.prototype.removeAllVectorsToPoints = function()
	{
		while (this.vecToPoints.length)
		{
			this.svg.removeChild(this.vecToPoints.pop());
			var pPoint = this.vecedPoints.pop();
			var iIndex = pPoint.vecedPoints.indexOf(this);
			pPoint.vecedPoints.splice(iIndex, 1);
			pPoint.vecToPoints.splice(iIndex, 1);
		}
	};

	Point.prototype.removeVectorToCursor = function()
	{
		if (this.vecToCursor)
		{
			this.svg.removeChild(this.vecToCursor);
			this.vecToCursor = null;
		}
	};


	var m_arrPointMatrix = [];
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
			fill: '#555'
		});
	}

	for (x = m_iPadding; x <= (pEditor.Canvas.drawHeight + m_iPadding); x += m_yStep) 
	{
		var pRow = pEditor.CSSClass.newClass(m_css.svg);
		m_arrRowCss.push(pRow);
		var pRowA = pEditor.CSSClass.newClass(pEditor.CSSClass.root);
		m_arrRowACss.push(pRowA);
		pEditor.CSSClass.newSelector(m_css.svg.s + pRowA.s + m_css.pix.S + pRow.s).setRules({
			fill: '#555'
		});
	}

	for (x = m_iPadding; x <= (pEditor.Canvas.drawWidth + m_iPadding); x += m_xStep)
	{
		var col = [];
		m_arrPointMatrix.push(col);
		for (var y = m_iPadding; y <= (pEditor.Canvas.drawHeight + m_iPadding); y += m_yStep)
		{
			var nPoint = new Point(x, y, m_nSVGCanvas, (m_arrPointMatrix.length - 1), col.length);
			m_arrColCss[(m_arrPointMatrix.length - 1)].applyClassTo(nPoint.dot);
			m_arrRowCss[col.length].applyClassTo(nPoint.dot);
			col.push(nPoint);
		}
	}


	/**
	 * Animate pointer
	 */
	var m_arrHighlightedPoints = [];
	pEditor.Animate.animate(function(){
		if (pEditor.Canvas.CanvasOverlay.mouseIsOver)
		{
			var nActivePix = getClosestPoint();
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
			var i;
			for (i = 0; i < m_arrHighlightedPoints.length; i++)
			{
				if (!pEditor.activeDraw || pEditor.activeDraw.canvasPoints.indexOf(m_arrHighlightedPoints[i]) === -1)
				{
					m_css.pixH.removeClassFrom(m_arrHighlightedPoints[i].dot);
					m_arrHighlightedPoints[i].removeAllVectorsToPoints();
				}
				m_arrHighlightedPoints[i].removeVectorToCursor();
			}
			var arrNewHighlighted = [];
			if (pEditor.activeDraw && pEditor.activeDraw.canvasPoints.length)
			{

				var pPoint = pEditor.activeDraw.canvasPoints[pEditor.activeDraw.canvasPoints.length - 1];
				m_css.pixH.applyClassTo(pPoint.dot);
				arrNewHighlighted.push(pPoint);
				if (m_bWireframe)
				{
					pPoint.vectorToCursor(pEditor.activePoint);
				}

				for (i = 0; i < pEditor.activeDraw.canvasPoints.length - 1; i++) 
				{
					pPoint = pEditor.activeDraw.canvasPoints[i];
					m_css.pixH.applyClassTo(pPoint.dot);
					arrNewHighlighted.push(pPoint);
					if (m_bWireframe)
					{
						pPoint.vectorToPoint(pEditor.activeDraw.canvasPoints[i + 1]);
					}
				}
				
			}
			m_arrHighlightedPoints = arrNewHighlighted;
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
			for (var j = 0; j < m_arrHighlightedPoints.length; j++)
			{
				m_css.pixH.removeClassFrom(m_arrHighlightedPoints[j].dot);
				m_arrHighlightedPoints[j].removeAllVectorsToPoints();
				m_arrHighlightedPoints[j].removeVectorToCursor();
			}
		}
	});


	function getClosestPoint()
	{
		var x = Math.min(Math.max(Math.floor(((m_iOffsetX - m_iPadding) + (m_xStep / 2)) / m_xStep), 0), m_arrPointMatrix.length - 1);
		var y = Math.min(Math.max(Math.floor(((m_iOffsetY - m_iPadding) + (m_yStep / 2)) / m_yStep), 0), m_arrPointMatrix[0].length - 1);
		return m_arrPointMatrix[x][y];
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
		fill: 'rgba(0,0,0,0.15)',
		r: '1px'
	});

	pEditor.CSSClass.newSelector(m_css.svg.s + m_css.pix.S + m_css.pixH.s).setRules({
		fill: '#4c4 !important',
		r: '2px'
	});

	pEditor.CSSClass.newSelector(m_css.svg.s + m_css.pix.S + m_css.pixA.s).setRules({
		fill: '#4c4 !important',
		r: '2px'
	});

	pEditor.CSSClass.newSelector(m_css.svg.s + m_css.vecP.S).setRules({
		stroke: '#4c4',
		'stroke-width': '1'
	});
	pEditor.CSSClass.newSelector(m_css.svg.s + m_css.vecC.S).setRules({
		stroke: '#4c4',
		'stroke-width': '1'
	});
});