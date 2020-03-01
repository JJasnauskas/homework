import React, { Component } from 'react'
import API from '../../utils/API'
import { debounce } from '../../utils/functions'
import { MovieIcon, SearchIcon } from '../../assets/icons'
import './home.css'

const debounceTime = 1000

export default class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {
      movies: [],
      limit: 8,
      queryMin: 3,
      query: '',
      errorMessage: '',
      loading: false,
      inputSelected: false,
      lastMovies: [],
      lastErrorMessage: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.searchMovies = this.searchMovies.bind(this)
    this.setCurrentMovie = this.setCurrentMovie.bind(this)
    this.handleClick = this.handleClick.bind(this)
    document.addEventListener('mousedown', this.handleClick, false)
  }

  debounceSearch = debounce(async (query) => {
    await this.searchMovies(query)
  }, debounceTime)

  handleClick(e) {
    setTimeout(() => { this.inputNode.focus() });
    if (this.node.contains(e.target)) {
      if (!!this.state.query.length && !!this.state.lastMovies.length) {
        this.setState(({ lastMovies }) => ({ movies: lastMovies }))
      }
      if (!!this.state.lastErrorMessage) {
        this.setState(({ lastErrorMessage }) =>({ errorMessage: lastErrorMessage }))
      }
      this.setState({ inputSelected: true })
      return
    }
    if (!!this.state.movies.length) {
      this.setState(({ movies }) => ({ lastMovies: movies, movies: [] }))
    }
    if (!!this.state.errorMessage) {
      this.setState(({ errorMessage }) =>({ lastErrorMessage: errorMessage, errorMessage: '' }))
    }
    this.setState({ inputSelected: false })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  async searchMovies(query) {

    this.setState({ loading: true, errorMessage: '' })

    try {
      const { results } = await API.fetchMovies(query)
      if (results.length > this.state.limit) {
        this.setState({ movies: results.slice(0, this.state.limit) })
      } else {
        this.setState({ movies: results })
      }
      if (!results.length) {
        this.setState({ errorMessage: 'No movies where found. Try typing another title.'})
      }
    } catch (error) {
      this.setState({ movies: [], errorMessage: error.message })
    } finally {
      this.setState({ loading: false })
    }
    
  }

  handleChange({ target: { name, value }}) {
    this.setState({
      [name]: value
    }, async () => {
      if (this.state.query.length >= this.state.queryMin) {
        this.debounceSearch(this.state.query)
      }
    })
  }

  setCurrentMovie(title) {
    this.setState({ query: title, movies: [], lastMovies: [], inputSelected: false })
  }

  render() {
    const { handleChange, setCurrentMovie, state: { movies, query, loading, inputSelected, errorMessage } } = this
    return (
      <div className="wrapper">
        <div className="main-container">
          <div className="header">
            <div ref={node => this.node = node} className="input-wrapper">
              <img className="movie-icon white-icon" src={MovieIcon}/>
              <div className="input-div">{!!query.length ? query : 'Enter a movie name'}
              </div>
              <img className={inputSelected ? 'movie-icon black icon-visible' : 'movie-icon orange-icon'} src={MovieIcon}/>
              { loading && inputSelected && <span className="loading"/> }
              <input ref={inputNode => this.inputNode = inputNode } name="query" value={query} onChange={handleChange} className={inputSelected ? 'movie-input visible' : 'movie-input'} />
              {inputSelected && <span className="movie-input-placeholder">Enter a movie name</span>}
              {!!errorMessage && <div className="error-message">{errorMessage}</div>}
              {!!movies.length &&
                <div className="movies-wrapper">
                  {movies.map((movie, key) => (
                    <div key={key} className="movie" onClick={() => setCurrentMovie(movie.title)}>
                      <h4>{movie.title}</h4>
                      <h6>{movie.vote_average} Rating{movie.release_date.split('-')[0] !== movie.release_date ? `, ${movie.release_date.split('-')[0]}` : ''}</h6>
                    </div>
                  ))}
                </div>
              }
            </div>
            <div className="search-icon-container">
              <img src={SearchIcon} className="search-icon orange-icon"/>
            </div>
          </div>
          <div className="content"/>
        </div>
      </div>
    )
  }
}