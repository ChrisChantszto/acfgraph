import React, { useCallback, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const LineChart = () => {


    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const [droCode, setDroCode] = useState("");

    const [inputError, setInputError] = useState(null);

    const fetchData = async () => {
        if (!droCode) {
            setInputError("DRO Code is required");
            return;
        }

        try {
            const response = await fetch(`http://localhost:443/api/data?dro_code=${droCode}`);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json()
            const acfData = [];
            const acfDate = [];

            console.log('Data: ', data);

            data.forEach((item) => {
                acfData.push(item.acf_share_able);
                acfDate.push(item.data_date);
            });

            if (acfData.length === 0 || acfDate.length === 0) {
                console.error('acf_data or acf_date is empty');
                return;
            }

            setChartData({
                labels: acfDate,
                datasets: [
                    {   
                        label: 'acf income',
                        data: acfData,
                        backgroundColor: 'rgba(75, 192, 192)',
                        borderColor: 'rgba(75, 192, 192)',
                        borderWidth: 1,
                        tension: 0.2,
                    }
                ],
            });
    } catch (error) {
        console.error("error");
    }};

    useEffect(() => {
        fetchData();
    }, []);

    const options = {

        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `the acf of ${droCode}`,
            }
        }
    }

    const handleDroCodeChange = (e) => {
        setDroCode(e.target.value);
        setInputError(null);
    };

    return (
        <div>
            <div>
                <label htmlFor="droCode">Enter DRO Code: </label>
                <input
                    type="text"
                    id="droCode"
                    value={droCode}
                    onChange={handleDroCodeChange}
                />
            <button onClick={fetchData}>Fetch Data</button>
            </div>
            {inputError && <p style={{ color: "red" }}>{inputError}</p>}
            <Line data={chartData} options={options} />
        </div>
    );
};

export default LineChart