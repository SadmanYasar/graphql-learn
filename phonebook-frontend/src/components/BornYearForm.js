import { useMutation } from "@apollo/client"
import { useState, useEffect } from "react"
import { UPDATE_BIRTHYEAR } from "../queries"

const BornYearForm = ({ authors, setError }) => {
    const [name, setname] = useState(authors[0].name)
    const [born, setborn] = useState('')
    const [setBirthYear, result] = useMutation(UPDATE_BIRTHYEAR, {
        onError: (error) => {
            setError('Invalid input')
            console.log(error)
        }
    })

    useEffect(() => {
        if (result.data && result.data.editAuthor === null) {
            setError('person not found')
        }
    }, [result.data]) // eslint-disable-line

    const submit = async (event) => {
        event.preventDefault()

        await setBirthYear({ variables: { name, setBornTo: parseInt(born) } })

        setname('')
        setborn('')
    }

    return (
        <>
            <h2>Set birthyear</h2>
            <form onSubmit={submit}>
                <select value={name} onChange={(event) => setname(event.target.value)}>
                    {authors.map((a, i) => {
                        return (
                            <option value={a.name} key={i}>{a.name}</option>
                        )
                    })}
                </select>
                <div>
                    born{' '}
                    <input
                        value={born}
                        onChange={({ target }) => setborn(target.value)} />
                </div>
                <button type="submit">change birth year</button>
            </form>
        </>
    )
}

export default BornYearForm