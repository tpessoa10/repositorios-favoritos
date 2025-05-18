import { useParams } from 'react-router-dom';
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from './Style';
import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa'
import api from '../../services/api';

export default function Repositorio() {
    const [repo, setRepo] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const { repositorio } = useParams();
    const [page, setPage] = useState(1)
    const [filters, SetFilters] = useState([
        { state: 'all', label: 'Todas', active: true },
        { state: 'open', label: 'Abertos', active: false },
        { state: 'closed', label: 'Fechados', active: false }
    ])
    const [filterIndex, setFilterIndex] = useState(0)

    async function load() {
        const nomeRepo = repositorio

        const [repositorioData, issuesData] = await Promise.all([
            api.get(`/repos/${nomeRepo}`),
            api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    per_page: 5,
                    page: page
                }
            })
        ])

        setRepo(repositorioData.data)
        setIssues(issuesData.data)
        setLoading(false)
    }

    function handlePage(action) {
        setPage(action === 'back' ? page - 1 : page + 1)
    }

    function handleFilter(index) {
        const newFilters = filters.map((f, i) => ({
            ...f,
            active: i === index
        }));
        SetFilters(newFilters);
        setFilterIndex(index);
        setPage(1);
    }

    useEffect(() => {
        load()
    }, [page, filterIndex, filters])

    console.log('repo ', repo)

    if (loading) {
        return (
            <Loading>
                Carregando...
            </Loading>
        )
    }

    return (
        <Container>
            <BackButton to={"/"}>
                <FaArrowLeft color='#000' size={35} />
            </BackButton>
            <Owner>
                <img src={repo.owner.avatar_url} alt={repo.owner.login} />
                <h1>{repo.name}</h1>
                <p>{repo.description}</p>
            </Owner>
            <FilterList active={filterIndex}>
                {filters.map((filter, index) => (
                    <button key={filter.label} type='button' onClick={() => handleFilter(index)}>{filter.label}</button>
                ))}
            </FilterList>
            <IssuesList>
                {issues.map(issue => (
                    <li key={issue.id}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(label => (
                                    <span key={label.id}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>
            <PageActions>
                <button disabled={page < 2} type='button' onClick={() => handlePage('back')}>Voltar</button>
                <button type='button' onClick={() => handlePage('next')}>Próximo</button>
            </PageActions>
        </Container>
    );
}