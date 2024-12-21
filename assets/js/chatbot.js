document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.add('show');
        chatbotToggle.classList.add('hide');
    });

    chatbotClose.addEventListener('click', function() {
        chatbotContainer.classList.remove('show');
        chatbotToggle.classList.remove('hide');
    });

    chatbotInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const userMessage = chatbotInput.value.trim();
            if (userMessage) {
                addMessage('You', userMessage);
                chatbotInput.value = '';
                fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: userMessage })
                })
                .then(response => response.json())
                .then(data => {
                    addMessage('AI', data.response);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    });

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${sender}: ${message}`;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});