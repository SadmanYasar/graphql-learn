import { useMutation } from "@apollo/client"
import { useState, useEffect } from "react"
import { UPDATE_BIRTHYEAR } from "../queries"

const BornYearForm = ({ setError }) => {
    const [name, setname] = useState('')
    const [born, setborn] = useState('')
    const [setBirthYear, result] = useMutation(UPDATE_BIRTHYEAR, {
        onError: (error) => {
            setError('Invalid input')
        }
    })

    useEffect(() => {
        if (result.data && result.data.editAuthor === null) {
            setError('person not found')
        }
    }, [result.data]) // eslint-disable-line

    const submit = async (event) => {
        event.preventDefault()

        setBirthYear({ variables: { name, setBornTo: parseInt(born) } })

        setname('')
        setborn('')
    }

    return (
        <>
            <h2>Set birthyear</h2><form onSubmit={submit}>
                <div>
                    name{' '}
                    <input
                        value={name}
                        onChange={({ target }) => setname(target.value)} />
                </div>
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