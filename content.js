const recognition = new webkitSpeechRecognition();
let post_bool = false;
let stop = false;

chrome.runtime.onMessage.addListener(function (message) {
    if (message.message == false) {
        console.log(recognition);
        stop = true;
        recognition.stop();
    }
    else if (message.message == true && 'webkitSpeechRecognition' in window) {

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log('Speech recognition started. Speak now...')
        };

        recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1];
            const transcript = result[0].transcript;
            console.log(`You said: ${transcript}`)
            if (transcript.toLowerCase() == "scroll down" && !post_bool) {
                console.log("scroll ran")
                window.scrollBy(0, 400);
            }

            else if (transcript.toLowerCase() == "scroll up" && !post_bool) {
                console.log("scroll ran up")
                window.scrollBy(0, -400);
            }

            else if ((transcript.toLowerCase() == "like" || transcript.toLowerCase() == "dislike") && !post_bool) {
                console.log(" like ran")
                const likeElements = document.querySelectorAll('.react-button__trigger');
                document.querySelector('.comment-button').click()
                for (const likeElement of likeElements) {
                    if (likeElement.getBoundingClientRect().top >= 100) {
                        likeElement.click();
                        break;
                    }
                }
            }

            //create a new post
            else if (transcript.toLowerCase() == "create post" && !post_bool) {
                console.log("create post ran")
                const create_post = document.querySelector('.share-box-feed-entry__trigger').click()
                post_bool = true;
            }

            else if (transcript.toLowerCase() == "cancel") {
                console.log("cancel ran")
                document.querySelector('.artdeco-modal__dismiss').click();
                document.querySelector('.artdeco-modal__confirm-dialog-btn').click()
                post_bool = false;

            }

            else if (post_bool) {
                const focusedElement = document.querySelector('.ql-editor[data-artdeco-is-focused="true"]');
                document.querySelector('.ql-editor').textContent += transcript.toLowerCase();
            }
        };

        recognition.onend = () => {
            console.log('Speech recognition ended.')
            if (message.message == true && !stop) {
                recognition.start();
            }
            stop = false;
        };

        // Event handler for errors
        recognition.onerror = (event) => {
            console.log(`Error: ${event.error}`)
        };

        if (message.message == true) {
            recognition.start();
        }
    }
});


window.onload = () => {
    chrome.storage.local.clear();
}
