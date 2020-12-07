import 'focus-visible/dist/focus-visible';

const styles = {
  // props are used to access theme utils such as colormode
  global: (props) => ({
    '.js-focus-visible': {
      /*
    This will hide the focus indicator if the element receives focus via the mouse,
    but it will still show up on keyboard focus.
    */
      outline: 'none',
      boxShadow: 'none',
    },
    '*': {
      border: 0,
      margin: 0,
      padding: 0,
      boxSizing: 'content-box',
      fontFeatureSettings: `'kern'`,
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
    },
    '*::before, *::after': {
      boxSizing: 'border-box',
      wordWrap: 'break-word',
    },
    'input:focus': {
      border: 'inherit',
    },
    'input:focus:invalid': {
      backround: 'rgba(255, 224, 224, 1)',
    },
    'input:focus, input:focus:valid': {
      backround: 'rgba(226, 250, 219, 1)',
    },
    'a:active, a:focus, a:visited': {
      outline: 0,
      border: 'none',
      outlineStyle: 'none',
      textDecoration: 'none',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0) !important',
    },
    'a:hover': {
      textDecoration: 'none',
    },
    a: {
      color: 'inherit',
    },
    html: {
      minWidth: '360px',
      scrollBehavior: 'smooth',
    },
    '#__next': {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
  }),
};

export default styles;
