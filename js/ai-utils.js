(function() {
  // Shared helper methods for the AI analysis features across visualizer pages.
  // Exposes `AIUtils` global with functions for showing, hiding and requesting
  // AI responses from the backend service.
  function showAIResponse(containerId, markdown) {
    const area = document.getElementById(containerId);
    if (!area) return;
    const content = area.querySelector('#aiResponseContent') || area.querySelector('.ai-response-content');
    if (!content) return;
    if (window.marked) {
      content.innerHTML = marked.parse(markdown);
    } else {
      content.textContent = markdown;
      console.warn('marked.js not found. Showing AI response as plain text.');
    }
    area.style.display = 'block';
  }

  function hideAIResponse(containerId) {
    const area = document.getElementById(containerId);
    if (!area) return;
    const content = area.querySelector('#aiResponseContent') || area.querySelector('.ai-response-content');
    if (content) content.innerHTML = '';
    area.style.display = 'none';
  }

  async function analyzeWithAI({endpoint, payload, buttonId, responseContainerId}) {
    const button = typeof buttonId === 'string' ? document.getElementById(buttonId) : buttonId;
    if (!button) return;

    button.textContent = 'Analyzing...';
    button.disabled = true;
    button.style.backgroundColor = '#a78bfa';
    button.style.cursor = 'not-allowed';
    const spinner = document.createElement('span');
    spinner.classList.add('loading-indicator');
    button.appendChild(spinner);

    hideAIResponse(responseContainerId);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMsg = 'Unknown backend error.';
        try {
          const errorBody = await response.json();
          errorMsg = errorBody.error || errorMsg;
        } catch (e) {
          errorMsg = response.statusText;
        }
        throw new Error(`Backend Error: ${response.status} ${errorMsg}`);
      }

      const data = await response.json();
      if (data && data.analysis) {
        showAIResponse(responseContainerId, data.analysis);
      } else {
        showAIResponse(responseContainerId, 'Invalid or empty AI response.');
      }

    } catch (error) {
      console.error('Error during backend call:', error);
      showAIResponse(responseContainerId, `AI analysis error: ${error.message || 'Network or backend issue.'}`);
    } finally {
      button.textContent = 'Analyze with AI';
      button.disabled = false;
      button.style.backgroundColor = '#10b981';
      button.style.cursor = 'pointer';
      const existing = button.querySelector('.loading-indicator');
      if (existing) existing.remove();
    }
  }

  window.AIUtils = { showAIResponse, hideAIResponse, analyzeWithAI };
})();
