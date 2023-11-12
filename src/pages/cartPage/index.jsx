import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import MainLayout from "../../layouts/main-layout";
import React, { useState, useEffect } from 'react';
import { PROMPT_PAY_IMG } from "../../utils/constants";

import { useDispatch } from 'react-redux';
import { dispatchCart } from '../../store/reducers/cart';
import { RiDeleteBinLine } from 'react-icons/ri';
import { BsBagCheckFill } from 'react-icons/bs';

import ProductCart from './components/ProductCart';

export default function CartPage() {
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [countDownTimeText, setCountDownTimeText] = useState("01:00");

    const [movieList, setMovieList] = useState([]);
    const [priceBeforeDiscount, setPriceBeforeDiscount] = useState(0);
    const [numsMovieSelected, setNumsMovieSelected] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [discountText, setDiscountText] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        initState();
    }, []);

    async function initState() {
        try {
            compareWithMovieForSell();
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => setShow(false);
    const handleOpen = () => {
        countDownTime();
        setShow(true);
    };

    const clearMovieForSell = () => {
        let _movieForSell = JSON.parse(localStorage.getItem("_movieForSell"));
        if (_movieForSell && _movieForSell.length > 0) {
            for (let item of _movieForSell) {
                if (item.total_selected > 0) {
                    item.total_selected = 0;
                }
            }
        }
        localStorage.setItem("_movieForSell", JSON.stringify(_movieForSell));
        dispatch(dispatchCart(0));
        compareWithMovieForSell();
    };

    function compareWithMovieForSell() {
        let _movieForSell = JSON.parse(localStorage.getItem("_movieForSell"));
        let movieSelected = [];
        if (_movieForSell) {
            let priceBeforeDiscountTmp = 0;
            let numsMovieSelectedTmp = 0;
            let discountTmp = 0;
            movieSelected = _movieForSell.filter(item => {
                if (item.total_selected && item.total_selected > 0) {
                    item = item;
                    item.total_price_per_item = item.total_selected * item.price_custom;

                    priceBeforeDiscountTmp += item.total_price_per_item;
                    numsMovieSelectedTmp += item.total_selected;

                    return item;
                }
            });

            if (numsMovieSelectedTmp >= 3 && numsMovieSelectedTmp < 5) {
                discountTmp = Math.round(priceBeforeDiscountTmp * (10 / 100));
                setDiscountText("10 % ซื้อ 3 รายการขึ้นไป");
            }
            else if (numsMovieSelectedTmp >= 5) {
                discountTmp = Math.round(priceBeforeDiscountTmp * (20 / 100));
                setDiscountText("20 % ซื้อ 5 รายการขึ้นไป");
            }

            setDiscount(discountTmp);
            setNumsMovieSelected(numsMovieSelectedTmp);
            setPriceBeforeDiscount(priceBeforeDiscountTmp);
            setTotalPrice(priceBeforeDiscountTmp - discountTmp);
        }
        setMovieList(movieSelected);
    }

    async function countDownTime() {
        let duration = 60 * 1;
        let timer = duration, minutes, seconds;
        let handleIntervalTime = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            let countDownTimeText = minutes + ":" + seconds;
            setCountDownTimeText(countDownTimeText);

            if (--timer < 0) {
                timer = duration;
            }

            if (minutes <= 0 && seconds <= 0) {
                clearInterval(handleIntervalTime);
                handleClose();
                clearMovieForSell();
            }
        }, 1000);
    }

    return (
        <MainLayout>

            <Container fluid={false} className="p-0 mt-3">
                <Row style={{ background: "white", padding: "2.5rem", borderRadius: "0.2rem" }} className='mb-3'>
                    <Col lg={12} md={12} xs={12}>
                        <Row className='mb-4 align-items-baseline' style={{ fontWeight: "500", fontSize: "1rem", background: "white" }}>
                            <Col lg={3} md={3} xs={12}>
                                <div>
                                    รูปภาพ
                                </div>
                            </Col>
                            <Col lg={3} md={3} xs={12}>
                                <div>เรื่อง</div>
                            </Col>
                            <Col lg={3} md={3} xs={12}>
                                <div>จำนวน x บาท</div>
                            </Col>
                            <Col lg={3} md={3} xs={12}>
                                <div style={{ float: "right" }}>รวม</div>
                            </Col>
                        </Row>

                        <ProductCart movieList={movieList} />

                        <Row style={{ display: (movieList && movieList.length > 0) ? 'block' : 'none' }}>
                            <Col xs={12} style={{ textAlign: "right" }}>
                                <Button variant="danger" onClick={clearMovieForSell}>
                                    <span className="d-flex align-items-center"><RiDeleteBinLine />&nbsp;ล้างข้อมูล</span>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{
                    background: "white", padding: "2.5rem", borderRadius: "0.2rem",
                    display: (movieList.length <= 0) ? 'none' : ''
                }} className='mb-4'>
                    <Col lg={6} md={6} xs={12}>

                    </Col>
                    <Col lg={6} md={6} xs={12}>
                        <Row>
                            <Col lg={6} md={6} xs={12}>
                                <p>ยอดรวมก่อนหักส่วนลด</p>
                            </Col>
                            <Col lg={6} md={6} xs={12}>
                                <p style={{ textAlign: "right" }}>{priceBeforeDiscount} บาท</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} xs={12}>
                                <p>ส่วนลด {discountText}</p>
                            </Col>
                            <Col lg={6} md={6} xs={12}>
                                <p style={{ textAlign: "right" }}>-{discount} บาท</p>
                            </Col>
                        </Row>
                        <Row style={{ fontWeight: "600", fontSize: "1rem" }}>
                            <Col lg={6} md={6} xs={12}>
                                <p>ยอดที่ต้องชำระ</p>
                            </Col>
                            <Col lg={6} md={6} xs={12}>
                                <p style={{ textAlign: "right" }}>{totalPrice} บาท</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{ textAlign: "right" }}>
                                <Button variant="primary" onClick={handleOpen}>
                                    <span className="d-flex align-items-center"><BsBagCheckFill /> &nbsp;สั่งสินค้า</span>
                                </Button>
                            </Col>
                        </Row>

                    </Col>
                </Row>

            </Container>


            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header>
                    <Modal.Title>ชำระเงิน</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs1'>
                            เวลาที่เหลืออีก: <span
                                style={{
                                    background: "#49e000",
                                    color: "white",
                                    padding: "1px 7px",
                                    borderRadius: 4
                                }}
                            >
                                {countDownTimeText}
                            </span> นาที
                        </p>
                        <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs1'>
                            ช่องทางการชำระเงิน: พร้อมเพย์
                        </p>
                        <div>
                            <img style={{ width: "50%" }} src={PROMPT_PAY_IMG} />
                        </div>
                        <p style={{ fontWeight: "500", fontSize: "1rem" }}>
                            ราคารวม: {totalPrice} บาท
                        </p>
                    </div>
                </Modal.Body>
            </Modal>

        </MainLayout>
    );
}