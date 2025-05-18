import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeleteButton } from './Style'
import { useCallback, useEffect, useState } from 'react'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function Main() {
    const [newRepo, setNewRepo] = useState("")
    const [repositorios, setRepositorios] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)

    function handleInputChange(e) {
        setNewRepo(e.target.value)
        setAlert(null)
    }

    useEffect(() => {
        const repoStorage = localStorage.getItem('repos')
        if (repoStorage) {
            setRepositorios(JSON.parse(repoStorage))
        }
    }, [])

    useEffect(() => {
        if (repositorios.length > 0) {
            localStorage.setItem("repos", JSON.stringify(repositorios))
        }
    }, [repositorios])


    async function Submit(e) {
        e.preventDefault()
        setLoading(true)
        setAlert(null)
        try {
            if (newRepo === "") {
                throw new Error("Indique um repositório")
            }

            const response = await api.get(`/repos/${newRepo}`)

            const repoExists = repositorios.find(repo => repo.name === response.data.full_name)

            if (repoExists) {
                throw new Error("Repositório duplicado")
            }

            const data = {
                name: response.data.full_name
            }

            setRepositorios(prevRepos => [...prevRepos, data])
            setNewRepo('')
            console.log(repositorios)
        } catch (e) {
            setAlert(true)
            console.log(e)
        } finally {
            setLoading(false)
        }
    }


    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find)
    }, [repositorios])

    console.log('repos ', repositorios)

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositórios
            </h1>

            <Form onSubmit={Submit} error={alert}>
                <input onChange={handleInputChange} value={newRepo} type="text" placeholder='Adicionar repositório' />

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner size={14} color='#fff' />
                    ) : (
                        <FaPlus color='#fff' size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    )
}