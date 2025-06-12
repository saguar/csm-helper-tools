window.AIUtils = {
  async analyzeWithAI(endpoint, payload) {
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
    return response.json();
  }
};
