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
		this.clearUnfinishedCurves();
		if (this.points.length && /[m]/gi.test(this.points[this.points.length-1]))
		{
			this.points.pop();
			this.canvasPoints.pop();
		}
		var pos = pPoint.pos;
		var relX = pos.x - this.getXBefore();
		var relY = pos.y - this.getYBefore();

		this.points.push('m'+relX+' '+relY);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.l = function(pPoint)
	{
		this.clearUnfinishedCurves();
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
		this.clearUnfinishedCurves();
		var pos = pPoint.pos;
		pPoint = pEditor.Canvas.CanvasOverlay.getPoint(pos.x, this.getYBefore());

		var relX = pos.x - this.getXBefore();

		this.points.push('h'+relX);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.v = function(pPoint)
	{
		this.clearUnfinishedCurves();
		var pos = pPoint.pos;
		pPoint = pEditor.Canvas.CanvasOverlay.getPoint(this.getXBefore(), pos.y);

		var relY = pos.y - this.getYBefore();

		this.points.push('v'+relY);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.z = function(pPoint)
	{
		this.clearUnfinishedCurves();
		if (this.points.length && this.points[this.points.length-1].toLowerCase() === 'z')
		{
			return;
		}
		this.points.push('z');
		for (var i = this.points.length - 1; i >= 0; i--) 
		{
			if (/[m]/gi.test(this.points[i]))
			{
				this.canvasPoints.push(this.canvasPoints[i]);
				break;
			}
		}

		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.q = function(pPoint)
	{
		if (this.points.length && /[Q]/g.test(this.points[this.points.length-1]))
		{
			return;
		}

		var pos = pPoint.pos;
		var relX = pos.x - this.getXBefore();
		var relY = pos.y - this.getYBefore();

		if (this.points.length && /[q]/g.test(this.points[this.points.length-1]))
		{
			this.points.push(' '+relX+' '+relY);
			this.canvasPoints.push(pPoint);
			this.node.setAttributeNS(null, 'd', this.getPath());
		}
		else
		{
			this.points.push('q'+relX+' '+relY);
			this.canvasPoints.push(pPoint);
		}
	};

	Path.prototype.M = function(pPoint)
	{
		this.clearUnfinishedCurves();
		if (this.points.length && /[m]/gi.test(this.points[this.points.length-1]))
		{
			this.points.pop();
			this.canvasPoints.pop();
		}
		var pos = pPoint.pos;

		this.points.push('M'+pos.x+' '+pos.y);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.L = function(pPoint)
	{
		this.clearUnfinishedCurves();
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
		this.clearUnfinishedCurves();
		var pos = pPoint.pos;
		pPoint = pEditor.Canvas.CanvasOverlay.getPoint(pos.x, this.getYBefore());

		this.points.push('H'+pos.x);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.V = function(pPoint)
	{
		this.clearUnfinishedCurves();
		var pos = pPoint.pos;
		pPoint = pEditor.Canvas.CanvasOverlay.getPoint(this.getXBefore(), pos.y);

		this.points.push('V'+pos.y);
		this.canvasPoints.push(pPoint);
		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.Q = function(pPoint)
	{
		if (this.points.length && /[q]/g.test(this.points[this.points.length-1]))
		{
			return;
		}

		var pos = pPoint.pos;

		if (this.points.length && /[Q]/g.test(this.points[this.points.length-1]))
		{
			this.points.push(' '+pos.x+' '+pos.y);
			this.canvasPoints.push(pPoint);
			this.node.setAttributeNS(null, 'd', this.getPath());
		}
		else
		{
			this.points.push('Q'+pos.x+' '+pos.y);
			this.canvasPoints.push(pPoint);
		}
	};

	Path.prototype.Z = function()
	{
		this.clearUnfinishedCurves();
		if (this.points.length && this.points[this.points.length-1].toLowerCase() === 'z')
		{
			return;
		}
		this.points.push('Z');
		for (var i = this.points.length - 1; i >= 0; i--) 
		{
			if (/[m]/gi.test(this.points[i]))
			{
				this.canvasPoints.push(this.canvasPoints[i]);
				break;
			}
		}

		this.node.setAttributeNS(null, 'd', this.getPath());
	};

	Path.prototype.getXBefore = function(iPoint)
	{
		var pPoint;
		if (this.points.length && /[q]/g.test(this.points[this.points.length-1]))
		{
			pPoint = this.canvasPoints[(iPoint || this.canvasPoints.length) - 2];
			return pPoint ? pPoint.pos.x : 0;
		}
		pPoint = this.canvasPoints[(iPoint || this.canvasPoints.length) - 1];
		return pPoint ? pPoint.pos.x : 0;
	};

	Path.prototype.getYBefore = function(iPoint)
	{
		var pPoint;
		if (this.points.length && /[q]/g.test(this.points[this.points.length-1]))
		{
			pPoint = this.canvasPoints[(iPoint || this.canvasPoints.length) - 2];
			return pPoint ? pPoint.pos.y : 0;
		}
		pPoint = this.canvasPoints[(iPoint || this.canvasPoints.length) - 1];
		return pPoint ? pPoint.pos.y : 0;
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

	Path.prototype.clearUnfinishedCurves = function()
	{
		if (this.points.length && /[q]/gi.test(this.points[this.points.length-1]))
		{
			this.delLast();
		}
	};


});