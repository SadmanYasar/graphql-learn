import { useApolloClient, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import Recommendation from './components/Recommendation'
import { ALL_AUTHORS, ALL_BOOKS, } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const authorResult = useQuery(ALL_AUTHORS)
  const bookResult = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (localStorage.getItem('phonenumbers-user-token')) {
      setToken(localStorage.getItem('phonenumbers-user-token'))
    }
  }, [])

  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }

  const logout = async () => {
    setToken(null)
    localStorage.clear()
    await client.resetStore()
    //window.location.reload()
  }

  if (authorResult.loading || bookResult.loading) {
    return <div>loading...</div>
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
          show={true}
        />
      </div>
    )
  }

  return (
    <>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendation')}>Recommendation</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} authors={authorResult.data.allAuthors} setError={notify} />

      <Books show={page === 'books'} books={bookResult.data.allBooks} />

      <NewBook show={page === 'add'} setError={notify} />

      <Recommendation show={page === 'recommendation'} />
    </>
  )
}

export default App
