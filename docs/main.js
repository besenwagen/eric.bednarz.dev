/* global document fetch */

const NAMESPACE_SVG = 'http://www.w3.org/2000/svg';
const SYMBOLS_URL = '/symbols.svg';
const ID_LOGO = 'logo';
const STATUS_OK = 200;

/**
 * @param {string} type
 * @returns {SVGElement}
 */
const createSvgElement = type =>
  document.createElementNS(NAMESPACE_SVG, type);

/**
 * @param {string} htmlLiteral
 * @return {*}
 */
function htmlLiteralToNode(htmlLiteral) {
  const container = document.createElement('DIV');

  container.innerHTML = htmlLiteral;

  return container.firstElementChild;
}

/**
 * @param {string} htmlLiteral
 * @return {SVGElement}
 */
function toSymbolContainer(htmlLiteral) {
  const element = htmlLiteralToNode(htmlLiteral);

  element.style.display = 'none';

  return element;
}

/**
 * @param {string} id
 * @returns {SVGElement}
 */
function useSymbol(id) {
  const [svgElement, useElement] = ['svg', 'use']
    .map(createSvgElement);

  useElement.setAttribute('href', `#${id}`);
  svgElement.setAttribute('aria-hidden', 'true');
  svgElement.appendChild(useElement);

  return svgElement;
}

/**
 * @param {SVGElement} svgElement
 */
function setSymbols(svgElement) {
  document
    .body
    .insertBefore(
      svgElement,
      document.body.firstChild
    );
}

/**
 * @param {string} name
 */
function replacePlaceholder(name) {
  const target = document.querySelector(`#${ID_LOGO} .${name}`);
  const replacement = useSymbol(name);

  replacement.setAttribute('class', target.className);
  target.parentNode.replaceChild(replacement, target);
}

function useSymbols() {
  for (const id of ['logomark', 'logotype']) {
    replacePlaceholder(id);
  }
}

/**
 * @param {Response} response
 * @returns {Promise}
 */
function handleResponse(response) {
  if (response.status === STATUS_OK) {
    return response.text();
  }

  return Promise.reject(response);
}

/**
 * @param {SVGElement} svgElement
 */
function render(svgElement) {
  setSymbols(svgElement);
  useSymbols();
}

/**
 * @param {Error} reason
 */
function handleRejection(reason) {
  console.error(reason);
}

fetch(SYMBOLS_URL)
  .then(handleResponse)
  .then(toSymbolContainer)
  .then(render)
  .catch(handleRejection);
