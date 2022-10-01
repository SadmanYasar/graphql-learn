import { useApolloClient, useQuery } from '@apollo/client'
import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const authorResult = useQuery(ALL_AUTHORS)
  const bookResult = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  if (authorResult.loading || bookResult.loading) {
    return <div>loading...</div>
  }

  return (
    <>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')} style={{ display: token ? '' : 'none' }} >add book</button>
        <button onClick={() => setPage('login')} style={{ display: !token ? '' : 'none' }}>login</button>
        <button onClick={logout} style={{ display: token ? '' : 'none' }}>logout</button>
      </div>

      <Authors show={page === 'authors'} authors={authorResult.data.allAuthors} setError={notify} />

      <Books show={page === 'books'} books={bookResult.data.allBooks} />

      <NewBook show={page === 'add' && token} setError={notify} />

      <LoginForm show={page === 'login' && !token} setError={notify} setToken={setToken} />
    </>
  )
}

export default App
