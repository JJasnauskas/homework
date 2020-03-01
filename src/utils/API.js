const apiKey = process.env.REACT_APP_MOVIE_API_KEY
const baseUrl = process.env.REACT_APP_MOVIE_API_URL

class Api {
  constructor() {
    this.fetchMovies = this.fetchMovies.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.headers = this.headers.bind(this)
  }

  fetchMovies(query) {
    return fetch(`${baseUrl}/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}`, { headers: this.headers() })
    .then(this.handleResponse)
  }

  async handleResponse(response) {
    if (response.status === 204) {
      return
    }
  
    if (response.status >= 200 && response.status < 300) {
      const a = await response.json()
      return a
    }
  
    if (response.status >= 400) {
      throw new Error('Failed to fetch movies')
    } 
  }

  headers() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
}

export default new Api()