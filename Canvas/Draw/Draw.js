'use strict';
SVGEditor.Modules.add('Canvas/Draw', {}, function(pEditor)
{

	pEditor.Canvas.Draw = {
		newPath: function(x, y){
			return new Path(x, y);
		}



	};




	function Path(x, y)
	{
		this.type = 'Path';
		this.path = 'M' + x + ' ' + y;
		this.lastPos = {
			x: x,
			y: y
		};
		this.node = pEditor.ElementConstructor.newElementSVG('path', {d: this.path});

		pEditor.Canvas.svg.appendChild(this.node);
	}

	Path.prototype.l = function(x, y)
	{
		var relX = x - this.lastPos.x;
		var relY = y - this.lastPos.y;
		this.lastPos.x = x;
		this.lastPos.y = y;

		this.path += ' l'+relX+' '+relY;
		this.node.setAttributeNS(null, 'd', this.path);
	};

	Path.prototype.h = function(x)
	{
		var relX = x - this.lastPos.x;
		this.lastPos.x = x;

		this.path += ' h'+relX;
		this.node.setAttributeNS(null, 'd', this.path);
	};

	Path.prototype.v = function(y)
	{
		var relY = y - this.lastPos.y;
		this.lastPos.y = y;

		this.path += ' v'+relY;
		this.node.setAttributeNS(null, 'd', this.path);
	};

	Path.prototype.z = function()
	{
		this.path += ' z';
		this.node.setAttributeNS(null, 'd', this.path);
	};









	Path.prototype.L = function(x, y)
	{
		this.lastPos.x = x;
		this.lastPos.y = y;

		this.path += ' L'+x+' '+y;
		this.node.setAttributeNS(null, 'd', this.path);
	};

	Path.prototype.H = function(x)
	{
		this.lastPos.x = x;

		this.path += ' H'+x;
		this.node.setAttributeNS(null, 'd', this.path);
	};

	Path.prototype.V = function(y)
	{
		this.lastPos.y = y;

		this.path += ' V'+y;
		this.node.setAttributeNS(null, 'd', this.path);
	};

	Path.prototype.Z = function()
	{
		this.path += ' Z';
		this.node.setAttributeNS(null, 'd', this.path);
	};

});