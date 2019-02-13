import React from 'react';
import {Bar} from 'react-chartjs';

const BOOKINGS_BUCKETS = {
  'Cheap': {
      min: 0,
      max: 100
  },
  'Moderate': {
      min: 100,
      max: 200
  },
  'Expensive': {
      min: 200,
      max: 100000
  }
};

const bookingsChart = props => {
    const chartData = {
        labels: [],
        datasets: []
    };
    let values = [];
    for (const bucket in BOOKINGS_BUCKETS) {
        chartData[bucket] = props.bookings.reduce((prev, current) => {
            if (current.event.price > BOOKINGS_BUCKETS[bucket].min && current.event.price < BOOKINGS_BUCKETS[bucket].max) {
                return prev + 1;
            } else {
                return prev;
            }

        }, 0);
        values.push(chartData[bucket]);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [chartData[bucket]]
        });
        values = [...values];
        values[values.length -1] = 0;
    }

    return (
        <div style={{textAlign: 'center'}}>
            <Bar
                data={chartData}/>
        </div>
    );
};

export default bookingsChart;
