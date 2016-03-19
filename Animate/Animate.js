'use strict';
SVGEditor.Modules.add('Animate', {order: 11}, function(pEditor)
{
	var m_arrAnimations = [];
	pEditor.Animate = {
		animate: function(fn)
		{
			m_arrAnimations.push(fn);
		}
	};


	function animate()
	{
		for (var i = 0; i < m_arrAnimations.length; i++)
		{
			m_arrAnimations[i]();
		}
		pEditor.window.requestAnimationFrame(animate);
	}
	pEditor.window.requestAnimationFrame(animate);
});