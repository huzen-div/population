import { Container, Row, Col, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import MainLayout from "../../layouts/main-layout";
import MovieItem from './components/MovieItem';
import React, { useState, useEffect, useMemo } from 'react';
import { movieService } from '../../services/api/movieService';

import { useDispatch } from 'react-redux';
import { dispatchCart } from '../../store/reducers/cart';

import { BiSearch } from 'react-icons/bi';

export default function HomePage() {
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("a");
    const [movieList, setMovieList] = useState([]);
    const [movieDetail, setMovieDetail] = useState({});
    const [moviePrice, setMoviePrice] = useState(1);
    const [addToCartMemo, setAddToCartMemo] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        initState();
    }, []);

    async function initState() {
        try {
            await searchMovie(search);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = (movie) => {
        setMovieDetail(movie);
        setShow(true);
    };

    const decreaseProduct = (movie) => {
        let total_selected = 0;
        if (movie.total_selected > 0) {
            total_selected = movie.total_selected -= 1;
        }
        let movieDetailTmp = { ...movie, total_selected: total_selected }
        addToCart(movieDetailTmp);
        dispatch(dispatchCart(total_selected));
    };

    const handleSearch = () => {
        searchMovie(search);
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

        compareWithMovieForSell(movieList);
        setAddToCartMemo((prev) => !prev);
    };

    const handleSavePrice = () => {
        let movieDetailTmp = { ...movieDetail, price_custom: parseInt(moviePrice) }

        let _movieForSell = JSON.parse(localStorage.getItem("_movieForSell"));
        if (_movieForSell) {
            _movieForSell = [..._movieForSell, { ...movieDetailTmp }]
        }
        else {
            _movieForSell = [{ ...movieDetailTmp }]
        }

        localStorage.setItem("_movieForSell", JSON.stringify(_movieForSell));
        setMoviePrice(1);
        compareWithMovieForSell(movieList);
        setShow(false);
    };

    const movieListMemo = useMemo(() => {
        return movieList
    }, [movieList, addToCartMemo]);


    async function searchMovie(query) {
        const response = await movieService.searchMovie(query);
        if (response.results) {
            compareWithMovieForSell(response.results);
        }
    }

    function compareWithMovieForSell(movieResults) {
        let _movieForSell = JSON.parse(localStorage.getItem("_movieForSell"));
        if (_movieForSell) {
            for (let itemResult of movieResults) {
                let isSame = _movieForSell.find(itemMovieForSell => itemMovieForSell.id === itemResult.id);
                if (isSame) {
                    itemResult.disableForEdit = true;
                    itemResult.price_custom = isSame.price_custom;
                    itemResult.total_selected = isSame.total_selected;
                }
            }
        }
        setMovieList(movieResults);
    }

    return (
        <MainLayout>
            <Container fluid={false} className="p-0 mt-3">
                <Row className="mb-3">
                    <Col className="pb-3" xs={12}>
                        <div style={{ background: "white", padding: "0.7rem", borderRadius: "0.2rem" }}>
                            <Row>
                                <Col className="py-2" lg={3} md={12} xs={12}>
                                    <InputGroup>
                                        <Form.Control value={search} onChange={e => setSearch(e.target.value)} 
                                            id="basic-search" aria-describedby="basic-addon3" 
                                        />
                                        <button type="button" className={`btn btn-primary`} onClick={() => handleSearch()}>
                                            <span className="d-flex align-items-center justify-content-center">
                                                <BiSearch />&nbsp;ค้นหา
                                            </span>
                                        </button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <MovieItem
                        movieList={movieListMemo}
                        handleShow={handleShow}
                        decreaseProduct={decreaseProduct}
                        increaseProduct={increaseProduct}
                    />
                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>รายละเอียด</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs1'>
                        เรื่อง: {movieDetail.title}
                    </p>
                    <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs2'>
                        คะแนนโหวต: {movieDetail.vote_count}
                    </p>
                    <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs2'>
                        ความนิยม: {movieDetail.popularity}
                    </p>
                    <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs2'>
                        วันที่ฉาย: {movieDetail.release_date}
                    </p>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>ราคา</Form.Label>
                        <Form.Control type="number" value={moviePrice} placeholder="ราคา" onChange={e => setMoviePrice(e.target.value)} 
                        onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() }/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        ปิด
                    </Button>
                    <Button variant="primary" onClick={handleSavePrice}>
                        บันทึก
                    </Button>
                </Modal.Footer>
            </Modal>

        </MainLayout>
    );
}