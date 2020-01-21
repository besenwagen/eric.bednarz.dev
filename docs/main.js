/* global fetch */

const NAMESPACE_SVG = 'http://www.w3.org/2000/svg';
const SYMBOLS_URL = '/symbols.svg';
const ID_LOGO = 'logo';
const STATUS_OK = 200;

const createSvgElement = type =>
  document.createElementNS(NAMESPACE_SVG, type);

/**
 * @param {string} htmlString
 * @return {Node}
 */
function htmlLiteralToNode(htmlLiteral) {
  const container = document.createElement('DIV');

  container.innerHTML = htmlLiteral;

  return container.firstElementChild;
}

/**
 * @param {string} htmlString
 * @return {Node}
 */
function toSymbolContainer(html) {
  const element = htmlLiteralToNode(html);

  element.style.display = 'none';

  return element;
}

function useSymbol(id) {
  const svgElement = createSvgElement('svg');
  const useElement = createSvgElement('use');

  useElement.setAttribute('href', `#${id}`);
  svgElement.appendChild(useElement);

  return svgElement;
}

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
  const target = document.querySelector(`#logo .${name}`);
  const replacement = useSymbol(name);

  replacement.setAttribute('class', target.className);
  target.parentNode.replaceChild(replacement, target);
}

function useSymbols() {
  const target = document.querySelector(ID_LOGO);

  for (const id of ['logomark', 'logotype']) {
    replacePlaceholder(id);
  }
}

function handleResponse(response) {
  if (response.status === STATUS_OK) {
    return response.text();
  }

  return Promise.reject(response);
}

function render(svgElement) {
  setSymbols(svgElement);
  useSymbols();
}

function handleRejection(reason) {
  console.error(reason);
}

fetch(SYMBOLS_URL)
  .then(handleResponse)
  .then(toSymbolContainer)
  .then(render)
  .catch(handleRejection);
