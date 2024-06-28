import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Check if the script is already added to prevent adding it again
    if (
      !document.querySelector(
        'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
      )
    ) {
      const addScript = document.createElement("script");
      addScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.async = true;
      document.body.appendChild(addScript);

      window.googleTranslateElementInit = () => {
        if (!document.getElementById("google_translate_element").firstChild) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "hi,ur,kn,ta,te,ml,or",
            },
            "google_translate_element"
          );
        }
      };
    }

    return () => {
      // Clean up script if necessary
      const translateElement = document.getElementById(
        "google_translate_element"
      );
      if (translateElement) {
        translateElement.innerHTML = ""; // Clear the content
      }
    };
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
