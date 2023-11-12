import { Col } from 'react-bootstrap';
import { MOVIE_COVER } from "../../../utils/constants";
import * as React from 'react';
import { IoIosPricetag } from 'react-icons/io';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const MovieItem = ({ movieList, handleShow, decreaseProduct, increaseProduct }) => {
    return movieList.map(item =>
        <Col lg={3} md={3} xs={12} key={item.id} style={{ marginBottom: "1.1rem" }}>
            <div style={{ background: "white", padding: "0.7rem", borderRadius: "0.2rem" }}>
                <div
                    style={{
                        background: "#11c917",
                        padding: "4px 12px",
                        color: "white",
                        borderRadius: 20,
                        float: "right",
                        display: (item.total_selected > 0) ? 'block' : 'none',
                    }}
                >{item.total_selected}
                </div>

                <div style={{ width: "50%", margin: "0 auto", marginBottom: "0.5rem" }}>
                    <img src={MOVIE_COVER}
                        style={{ width: "100%", borderRadius: "0.3rem" }} />
                </div>
                <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs1'>
                    เรื่อง: {item.title}
                </p>
                <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs2'>
                    คะแนนโหวต: {item.vote_count}
                </p>
                <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs2'>
                    ความนิยม: {item.popularity}
                </p>
                <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs2'>
                    วันที่ฉาย: {item.release_date}
                </p>

                <p style={{ marginBottom: "0.5rem" }} className='ellipsis-cs ellipsis-cs2'>
                    ราคา {(item.price_custom > 0) ? `${item.price_custom} บาท` : 'ยังไม่กำหนด'}
                </p>

                <div className={`d-flex flex-row-reverse gap-2 mb-2 ${(item.price_custom > 0) ? 'visible' : 'invisible'}`}>
                    <button type="button" className={`btn btn-success`} onClick={() => increaseProduct(item)}>
                        <span className="d-flex align-items-center"><AiOutlineShoppingCart />&nbsp;เพิ่ม</span>
                    </button>
                    <button type="button" className={`btn btn-danger`} onClick={() => decreaseProduct(item)}>
                        <span className="d-flex align-items-center"><AiOutlineShoppingCart />&nbsp;ลด</span>
                    </button>
                </div>

                <div className="d-flex flex-column">
                    <button type="button" className={`btn btn-${(item.price_custom > 0) ? 'secondary disabled' : 'primary'}`} onClick={() => handleShow(item)}>
                        <span className="d-flex align-items-center justify-content-center">
                            <IoIosPricetag style={{ display: (item.price_custom > 0) ? 'none' : 'block' }} />&nbsp;{(item.price_custom > 0) ? 'ใส่ราคาแล้ว' : 'ใส่ราคา'}
                        </span>
                    </button>
                </div>
            </div>
        </Col>
    )
};
export default MovieItem;
