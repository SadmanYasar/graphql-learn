import { useQuery } from "@apollo/client"
import { ME } from "../queries"

const Recommendation = (props) => {
    const user = useQuery(ME, {
        fetchPolicy: 'no-cache'
    })

    if (!props.show) {
        return null
    }

    return (
        <>
            <h1>Recommendations</h1>
            <p>Books in your favourite genre {user.data?.me?.favouriteGenre}</p>
        </>
    )
}

export default Recommendation