class OpenIDFederationAPIClient {
  /**
   * Initialize the client with base URL and API key if required
   * @param {string} baseUrl Base URL of the API
   * @param {object} [options] Optional configurations
   */
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
  }

  /**
   * Handle API errors uniformly
   * @param {Error} error Error object
   */
  handleError(error) {
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      console.error('No response from API:', error.request);
    } else {
      console.error('Error creating request:', error.message);
    }
    throw error;
  }

  /**
   * Generic request handler
   * @param {string} endpoint API endpoint
   * @param {string} method HTTP method
   * @param {object} [data] Request body
   * @returns {Promise<any>} API response
   */
  async request(endpoint, method='GET', data=null) {
    const headers = {
      'Content-Type': 'application/json'
    };

    const options = {
      method,
      headers,
      body: data ? JSON.stringify(data) : null
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      // console.log(response.status, endpoint, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      this.handleError(error);
    }
  }


  /**
   * Generic GET request
   * @param {string} endpoint API endpoint
   * @returns {Promise<any>} API response
   */
  async get(endpoint) {
    try {
      return await this.request(endpoint);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Generic POST request
   * @param {string} endpoint API endpoint
   * @param {object} data Payload for the request
   * @returns {Promise<any>} API response
   */
  async post(endpoint, data) {
    try {
      return await this.request(endpoint, 'POST', data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async list(criteria={}) {
    const queryString = new URLSearchParams(criteria).toString();
    return await this.get(`/list?${queryString}`);
  }
  
  async fetch(uri) {
    return this.get(`/fetch?sub=${encodeURIComponent(uri)}`);
  }

  async resolve(sub, anchor, type=null) {
    return this.get(`/resolve?sub=${encodeURIComponent(sub)}&anchor=${encodeURIComponent(anchor)}&type=${encodeURIComponent(type)}`);
  }

  async trustMark(sub, trustMarkId) {
    return this.get(`/trust-mark?sub=${encodeURIComponent(sub)}&trust_mark_id=${encodeURIComponent(trustMarkId)}`);
  }

  async trustMarkStatus(sub, trustMarkId, trustMarkJWT, iat=null) {
    return this.get(`/trust-mark-status?sub=${encodeURIComponent(sub)}&trust_mark_id=${encodeURIComponent(trustMarkId)}&trust_mark=${encodeURIComponent(trustMarkJWT)}&iat=${encodeURIComponent(iat)}`);
  }

  async trustMarkHolders(trustMarkId, sub=null) {
    return this.get(`/trust-mark-list?trust_mark_id=${encodeURIComponent(trustMarkId)}&sub=${encodeURIComponent(sub)}`);
  }

  async historicalKeys() {
    return this.get(`/historical-keys`);
  }
}

export { OpenIDFederationAPIClient as Client }
