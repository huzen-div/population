import { Container, Row, Col } from 'react-bootstrap';
import MainLayout from "../../layouts/main-layout";
import MovieItem from '../homePage/components/MovieItem';
import React, { useState, useMemo } from 'react';

import { useDispatch } from 'react-redux';
import { dispatchCart } from '../../store/reducers/cart';

export default function MoviePage() {
    const [addToCartMemo, setAddToCartMemo] = useState(false);
    const dispatch = useDispatch();

    const handleShow = (movie) => { };

    const decreaseProduct = (movie) => {
        let total_selected = 0;
        if (movie.total_selected > 0) {
            total_selected = movie.total_selected -= 1;
        }
        let movieDetailTmp = { ...movie, total_selected: total_selected }
        addToCart(movieDetailTmp);
        dispatch(dispatchCart(total_selected));
    };

    const increaseProduct = (movie) => {
        let total_selected = 1;
        if (movie.total_selected > 0) {
            total_selected = movie.total_selected += 1;
        }
        let movieDetailTmp = { ...movie, total_selected: total_selected }
        addToCart(movieDetailTmp);
        dispatch(dispatchCart(total_selected));
    };

    const addToCart = (movieDetailTmp) => {
        let _movieForSell = JSON.parse(localStorage.getItem("_movieForSell"));
        let indexMovieForSell = _movieForSell.findIndex(item => item.id === movieDetailTmp.id);
        _movieForSell[indexMovieForSell].total_selected = movieDetailTmp.total_selected;
        localStorage.setItem("_movieForSell", JSON.stringify(_movieForSell));
        setAddToCartMemo((prev) => !prev);
    };

    const movieListMemo = useMemo(() => {
        let _movieForSell = JSON.parse(localStorage.getItem("_movieForSell"));
        return (_movieForSell) ? _movieForSell : [];
    }, [addToCartMemo]);

    return (
        <MainLayout>
            <Container fluid={false} className="p-0 mt-3">
                <Row>
                    <MovieItem
                        movieList={movieListMemo}
                        handleShow={handleShow}
                        decreaseProduct={decreaseProduct}
                        increaseProduct={increaseProduct}
                    />
                </Row>
                <Row style={{ display: (movieListMemo < 1) ? 'block' : 'none' }}>
                    <Col xs={12} style={{ marginBottom: "1.1rem" }}>
                        <div style={{ background: "white", padding: "2rem", borderRadius: "0.2rem", textAlign: "center" }}>
                            ไม่พบข้อมูล
                        </div>
                    </Col>
                </Row>
            </Container>
        </MainLayout>
    );
}