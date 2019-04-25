/**
 *	 Log.js - кастомная браузерная консоль
 *
 *	 Инициализировать в самом начале
 *
 *	aleqsunder, v.0.1, 2019г.
 */

const color =
{ 
	default: { nameBackground: '#006400', background: '#013c01', text: '#fff' },
	error: { nameBackground: '#8B0000', background: '#6b0101', text: '#fff' },
	warn: { nameBackground: '#FF8C00', background: '#9c5703', text: '#fff' }
};
	
var log = function (title, text) { comment('default', title, text) }
log.error = function (title, text) { comment('error', title, text) }
log.warn = function (title, text) { comment('warn', title, text) }
log.enable = true;

function comment (name, title, text)
{
	setTimeout
	( console.log.bind (
			console, "%c%s%c %s", `
				background: `+ color[name].nameBackground +`;
				color: `+ color[name].text +`;
				padding: 2px 6px; border-radius: 4px;
			`, title, "", text
	));
}