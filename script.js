document.getElementById('convertBtn').addEventListener('click', () => {
    const clpAmount = document.getElementById('clpAmount').value;
    const currency = document.getElementById('currency').value;
    
    if (!clpAmount || clpAmount <= 0) {
        alert('Por favor ingrese un monto válido en CLP.');
        return;
    }

    
    fetch(`https://mindicador.cl/api/${currency}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la consulta: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos de la API recibidos:", data); 

            if (data && data.serie && data.serie.length > 0) {
                const exchangeRate = data.serie[0].valor;
                const convertedAmount = clpAmount / exchangeRate;
                document.getElementById('result').innerText = `${clpAmount} CLP son ${convertedAmount.toFixed(2)} ${currency.toUpperCase()}`;
    
                
                const labels = data.serie.slice(0, 5).map(entry => entry.fecha.split('T')[0]);
                const values = data.serie.slice(0, 5).map(entry => entry.valor);
    
                showChart(labels, values, currency.toUpperCase());
            } else {
                alert('No se encontraron datos históricos.');
            }
        })
        .catch(error => {
            alert('Ocurrió un error al consultar los datos.');
            console.error("Error:", error);
        });
});


function showChart(labels, values, currency) {
    const ctx = document.getElementById('currencyChart').getContext('2d');
    
    if (window.myChart) {
        window.myChart.destroy();  
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.reverse(),
            datasets: [{
                label: `Valor del ${currency}`,
                data: values.reverse(),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
