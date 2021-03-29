import React, { useEffect, useRef, useCallback } from 'react'
import ListOfGifs from 'components/ListOfGifs'
import Spinner from 'components/Spinner'

import { useGifs } from 'hooks/useGifs'
import useNearScreen from 'hooks/useNearScreen'

import debounce from 'just-debounce-it'
import { Helmet } from 'react-helmet'
import SearchForm from 'components/SearchForm'

export default function SearchResults({ params }) {
    const { keyword, rating } = params
    const { loading, gifs, setPage } = useGifs({ keyword })

    const externalRef = useRef()
    const { isNearScreen } = useNearScreen({
        externalRef: loading ? null : externalRef,
        once: false
    })

    const title = gifs ? `Resultados de ${keyword}` : loading ? 'Cargando ...' : ''

    const debounceHandleNextPage = useCallback(debounce(
        () => setPage(prevPage => prevPage + 1), 500
    ), [setPage])

    useEffect(function () {
        console.log(isNearScreen)
        if (isNearScreen) debounceHandleNextPage()
    }, [debounceHandleNextPage, isNearScreen])

    return <>
        {loading
            ? <Spinner />
            : <>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                    <meta name="rating" content="General" />
                </Helmet>

                <header className="o-header">
                    <SearchForm initialKeyword={keyword} initialRating={rating} />
                </header>

                <h3 className="App-title">{decodeURI(keyword)}</h3>
                <ListOfGifs gifs={gifs} />
                <div id="visor" ref={externalRef}></div>
            </>
        }
    </>
}