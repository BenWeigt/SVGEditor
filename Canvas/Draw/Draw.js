'use strict';
SVGEditor.Modules.add('Canvas/Draw', {}, function(pEditor)
{

	pEditor.Canvas.Draw = {
		newPath: function(x, y){
			return new Path(x, y);
		}
	};


	function Path(pPoint)
	{
		this.type = 'Path';
		this.points = ['M'+pPoint.pos.x+' '+pPoint.pos.y];
		this.canvasPoints = [pPoint];
		this.node = pEditor.ElementConstructor.newElementSVG('path', {d: this.getPath()});

		pEditor.Canvas.svg.appendChild(this.node);
	}

	Path.prototype.m = function(pPoint)
	{
		var pos = pPoint.pos;
		var relX = pos.x - this.getXBefore();
		var relY = pos.y - this.getYBefore();

		this.points.push('m'+relX+' '+relY);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.l = function(pPoint)
	{
		var pos = pPoint.pos;
		var relX = pos.x - this.getXBefore();
		var relY = pos.y - this.getYBefore();
		if (!relX)
		{
			return this.v(pPoint);
		}
		if (!relY)
		{
			return this.h(pPoint);
		}

		this.points.push('l'+relX+' '+relY);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.h = function(pPoint)
	{
		var pos = pPoint.pos;
		pPoint = pEditor.Canvas.CanvasOverlay.getPoint(pos.x, this.getYBefore());

		var relX = pos.x - this.getXBefore();

		this.points.push('h'+relX);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.v = function(pPoint)
	{
		var pos = pPoint.pos;
		pPoint = pEditor.Canvas.CanvasOverlay.getPoint(this.getXBefore(), pos.y);

		var relY = pos.y - this.getYBefore();

		this.points.push('v'+relY);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.z = function(pPoint)
	{
		this.points.push('z');
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.M = function(pPoint)
	{
		var pos = pPoint.pos;

		this.points.push('M'+pos.x+' '+pos.y);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.L = function(pPoint)
	{
		var pos = pPoint.pos;
		if (this.getXBefore() == pos.x)
		{
			return this.V(pPoint);
		}
		if (this.getYBefore() == pos.y)
		{
			return this.H(pPoint);
		}

		this.points.push('L'+pos.x+' '+pos.y);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.H = function(pPoint)
	{
		var pos = pPoint.pos;
		pPoint = pEditor.Canvas.CanvasOverlay.getPoint(pos.x, this.getYBefore());

		this.points.push('H'+pos.x);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.V = function(pPoint)
	{
		var pos = pPoint.pos;
		pPoint = pEditor.Canvas.CanvasOverlay.getPoint(this.getXBefore(), pos.y);

		this.points.push('V'+pos.y);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.Z = function(pPoint)
	{
		var pos = pPoint.pos;
		this.points.push('Z');
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.getXBefore = function(iPoint)
	{
		return this.canvasPoints[(iPoint || this.canvasPoints.length) - 1].pos.x;
	};

	Path.prototype.getYBefore = function(iPoint)
	{
		return this.canvasPoints[(iPoint || this.canvasPoints.length) - 1].pos.y;
	};

	Path.prototype.delLast = function()
	{
		this.points.pop();
		this.canvasPoints.pop();

		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.remove = function()
	{
		pEditor.Canvas.svg.removeChild(this.node);
	};

	Path.prototype.getPath = function()
	{
		var strPath = '';
		for (var i = 0; i < this.points.length; i++) 
		{
			strPath += this.points[i];
		}
		return strPath;
	};


});