# Auto Translator

This is a web extension app that translates the webpage you are in. You can either choose to auto translate for DOM texts or words in images.

## Instructions for Build and Use

**Steps to build and/or run the software:**

1. go to manage extensions and turn on developers mode on the top right corner. 

2. Click load unpacked and go to assets folder and choose chrome-dev file.

3. Click on the webextension and it will have the side-panel pop-up. 

**Instructions for using the software:**

1. npm i to install all the needed dependencies. 
2. May have to enable chrome://chrome-urls/ then to chrome://on-device-translation-internals and enable en -> ko and en -> es
3. If it still doesn't work, try doing step 2 of "Development Environment"

## Development Environment

To recreate the development environment, you need the following software and/or libraries with the specified versions:

* npm create plasmo omni-translate to set up the environment in running plasmo framework.
* In package.json file, have this: "manifest": {"permissions": ["sidePanel", "storage"]}

## Useful Websites to Learn More

I found these websites useful in developing this software:

* Build a Chrome Extension using Plasmo, https://www.youtube.com/watch?v=suDy5SNbXsI
* Introduction to Plasmo, https://docs.plasmo.com/
* mutationObserever https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
* IntersectionObserver https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
* googles free ai translation api https://developer.chrome.com/docs/ai/translator-api#:~:text=The%20Translator%20API%20uses%20an,const%20translator%20=%20await%20Translator.

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* I plan to use gemini API to create a system where it takes the url where you are in if you press a button and puts it through
* Gemini nano banana and extracts the text from all the images. It will then display the original word and translated word for you to see so that you can
* read any image in another language in english. 
