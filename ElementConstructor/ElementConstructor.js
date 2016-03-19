'use strict';
SVGEditor.Modules.add('ElementConstructor', {order: 10}, function(pEditor)
{
	var m_strSVGNs = 'http://www.w3.org/2000/svg';

	pEditor.ElementConstructor = {
		newElement: function(strTag, pAttributes, strInnerHTML)
		{
			var nEl = pEditor.document.createElement(strTag);
			for (var strAttribute in pAttributes)
			{
				nEl.setAttribute(strAttribute, pAttributes[strAttribute]);
			}
			nEl.innerHTML = strInnerHTML || nEl.innerHTML;
			return nEl;
		},

		newElementSVG: function(strTag, pAttributes, strInnerHTML)
		{
			var nEl = pEditor.document.createElementNS(m_strSVGNs, strTag);
			for (var strAttribute in pAttributes)
			{
				nEl.setAttributeNS(null, strAttribute, pAttributes[strAttribute]);
			}
			nEl.innerHTML = strInnerHTML || nEl.innerHTML;
			return nEl;
		}
	};
});