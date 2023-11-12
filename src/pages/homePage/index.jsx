// import { Container, Row, Col, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import MainLayout from "../../layouts/main-layout";
// import MovieItem from './components/MovieItem';
import React, { useState, useEffect, useMemo } from 'react';
// import { movieService } from '../../services/api/movieService';

// import { useDispatch } from 'react-redux';
// import { dispatchCart } from '../../store/reducers/cart';

// import { BiSearch } from 'react-icons/bi';


// import React from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// import BarChart from 'chart-race-react';


export default function HomePage() {
    const options = {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'My chart'
        },
        series: [
            {
                data: [1, 2, 1, 4, 3, 6]
            }
        ]
    };

    return (
        <MainLayout>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </MainLayout>
        // <MainLayout>

        //     <BarChart />

        // </MainLayout>
    );
}