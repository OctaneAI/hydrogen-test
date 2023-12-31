import {useNonce} from '@shopify/hydrogen';
import {useEffect} from 'react';

export default function Homepage() {
  const nonce = useNonce();

  const addOctaneScript = () => {
    const octaneScript = document.createElement('script');
    octaneScript.setAttribute(
      'src',
      'https://app.octaneai.com/kucsxqo0s89oqezd/quiz.js',
    );
    octaneScript.setAttribute('async', 'true');
    octaneScript.setAttribute('defer', 'true');
    octaneScript.nonce = nonce;
    // scr.async = true;
    // scr.defer = true;
    document.body.appendChild(octaneScript);
  };

  useEffect(() => {
    if (document.contains(document.querySelector('.octane-ai-quiz'))) {
      addOctaneScript();
      return;
    }
    const observer = new MutationObserver(function (_) {
      if (document.contains(document.querySelector('.octane-ai-quiz'))) {
        addOctaneScript();
        observer.disconnect();
      }
    });
    observer.observe(document, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: true,
    });
  }, []);

  return (
    <>
      <div
        className="octane-ai-quiz"
        data-quiz-id="JwXSSyUcC9VYyC1h"
        data-embed-type="fullpage"
        data-mobile-height="match_browser"
        data-desktop-height="match_browser"
      ></div>
    </>
  );
}
