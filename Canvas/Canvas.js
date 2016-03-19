'use strict';
SVGEditor.Modules.add('Canvas', {}, function(pEditor)
{

	pEditor.Canvas = {
		drawWidth: pEditor.config.height,
		drawHeight: pEditor.config.width,
		width: pEditor.config.canvas.height,
		height: pEditor.config.canvas.width,
		svg: null
	};

	var m_nSVGCanvas = pEditor.ElementConstructor.newElementSVG('svg', {
		width: pEditor.Canvas.drawHeight,
		height: pEditor.Canvas.drawWidth,
		viewBox: '0 0 '+ pEditor.Canvas.width + ' ' + pEditor.Canvas.height
	});

	pEditor.content.appendChild(m_nSVGCanvas);
	pEditor.Canvas.svg = m_nSVGCanvas;
	








	function createTilingBackground(iContainerW, iContainerH, iGridW, iGridH)
	{			
		var nSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		nSVG.setAttribute('width', iContainerW);
		nSVG.setAttribute('height', iContainerH);
		
		var nDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
		nSVG.appendChild(nDefs);

		var nPattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
		nDefs.appendChild(nPattern);

		// The size of the pattern as a fraction of the whole SVG.
		var fWidthRatio = (1 / iGridW) * 2;
		var fHeightRatio = (1 / iGridH) * 2;

		nPattern.setAttribute('width', fWidthRatio);
		nPattern.setAttribute('height', fHeightRatio);
		// Coordinates inside the pattern are fractions of the pattern container.
		nPattern.setAttribute('patternContentUnits', 'objectBoundingBox');
		nPattern.setAttribute('id', 'gridPattern');
		
		// The size of each grid box, as a ratio of the parent container.
		var fGridBoxW = fWidthRatio / 2;
		var fGridBoxH = fHeightRatio / 2;
		
		// Create a new <rect>.
		function _createRect(x, y, width, height, fill)
		{
			var nBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			nBox.setAttribute('x', x);
			nBox.setAttribute('y', y);
			nBox.setAttribute('width', width);
			nBox.setAttribute('height', height);
			nBox.setAttribute('fill', fill);
			
			return nBox;
		}
		
		// Append grid rects into pattern.
		nPattern.appendChild(_createRect(0,         0,         fGridBoxW, fGridBoxH, 'red'));
		nPattern.appendChild(_createRect(fGridBoxW, 0,         fGridBoxW, fGridBoxH, 'blue'));
		nPattern.appendChild(_createRect(0,         fGridBoxH, fGridBoxW, fGridBoxH, 'green'));
		nPattern.appendChild(_createRect(fGridBoxW, fGridBoxH, fGridBoxW, fGridBoxH, 'purple'));
		
		// Finally, create the rect which will contain the pattern.
		var nRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		nSVG.appendChild(nRect);
		nRect.setAttribute('fill', 'url(#gridPattern)');
		nRect.setAttribute('width', iContainerW);
		nRect.setAttribute('height', iContainerH);
		nRect.setAttribute('x', 0);
		nRect.setAttribute('y', 0);
		
		return nSVG;
	}







	
	// This kinda works? Swagginz. Dem colours thou.
	//pEditor.content.appendChild(pEditor.Canvas.createTilingBackground(500, 500, 500, 500));
	// Create the grid somewhere.
});