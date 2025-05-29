(function (action) {
  const element = document.querySelector('section code pre');

  if (!element) {
    console.error('Element not found with selector:', selector);
    return Promise.reject('Element not found');
  }

  const title = document.querySelector('header:has(h1)')?.textContent || '';

  let text = element.textContent;
  if (text.endsWith('\nX')) {
    text = text.substring(0, text.length - 1);
  }

  if (action === 'copy_chords') {
    copyToClipboard(text);
  } else if (action === 'copy_projector_url') {
    copyToClipboard(constructChordProjectorUrl(text, title));
  } else if (action === 'open_projector') {
    openWindow(constructChordProjectorUrl(text, title));
  } else if (action === 'open_projector_in_place') {
    location.href = constructChordProjectorUrl(text, title);
  } else {
    console.log('Invalid action');
    return Promise.reject('Invalid action');
  }

  function constructChordProjectorUrl(text, title) {
    // const url = 'file:////Users/brunoalfirefic/git/ChordProjector/chord_projector.html';
    const url = 'https://brunoalfirevic.github.io/ChordProjector/chord_projector.html';
    return url + '#?text=' + encodeURIComponent(text) + '&title=' + encodeURIComponent(title);
  }

  function openWindow(url) {
    const openedWindow = window.open(url, '_blank');
    if (openedWindow) {
      openedWindow.focus();
    }
  }

  function copyToClipboard(text) {
    /* Try to use the Clipboard API first (modern browsers) */
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Text copied to clipboard');
          return true;
        })
        .catch(err => {
          console.error('Clipboard API failed:', err);
          /* Try fallback method */
          return fallbackCopy(text);
        });
    } else {
      /* Use fallback for browsers without Clipboard API */
      return Promise.resolve(fallbackCopy(text));
    }

    function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;

      /* Make it invisible */
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.setAttribute('readonly', ''); /* Prevent mobile keyboards */

      document.body.appendChild(textarea);

      /* Special handling for iOS */
      const isIOS = navigator.userAgent.match(/ipad|iphone/i);

      if (isIOS) {
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textarea.setSelectionRange(0, 999999); /* For mobile devices */
      } else {
        textarea.select();
      }

      let success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
      }

      /* Clean up */
      document.body.removeChild(textarea);
      return success;
    }
  }
})('open_projector'); /* copy_chords, copy_projector_url, open_projector, open_projector_in_place */