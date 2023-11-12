import { Row, Col } from 'react-bootstrap';
import React from 'react';
import { MOVIE_COVER, } from "../../../utils/constants";


const ProductCart = ({ movieList }) => {
    return movieList.map(item =>
        <Row style={{ background: "white" }} className='mb-2 align-items-baseline' key={item.id}>
            <Col lg={3} md={3} xs={12}>
                <div>
                    <img src={MOVIE_COVER}
                        style={{ width: "30%", borderRadius: "0.3rem" }} />
                </div>
            </Col>
            <Col lg={3} md={3} xs={12}>
                <div className='ellipsis-cs ellipsis-cs1'>{item.title}</div>
            </Col>
            <Col lg={3} md={3} xs={12}>
                <div>{item.total_selected} x {item.price_custom}</div>
            </Col>
            <Col lg={3} md={3} xs={12}>
                <div style={{ float: "right" }}>{item.total_price_per_item} บาท</div>
            </Col>
        </Row>
    )
};

export default ProductCart;
