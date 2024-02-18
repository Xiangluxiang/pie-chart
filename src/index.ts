import Chart from 'chart.js/auto';

const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
const labelInput = document.getElementById('labelInput') as HTMLInputElement;
const dataInput = document.getElementById('dataInput') as HTMLInputElement;
const addDataBtn = document.getElementById('addDataBtn') as HTMLButtonElement;
const dataTableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

let data = {
    datasets: [{
        data: [],
        backgroundColor: [],
    }],
    labels: []
};

const myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: {}
});

function generateRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function isValidColor(strColor: string) {
    const s = new Option().style;
    s.color = strColor;
    return s.color === strColor.toLowerCase();
}

function updateOrAddChartData(label: string, value: number, existingColor?: string) {
    const labelIndex = myPieChart.data.labels?.indexOf(label);
    const color = existingColor || isValidColor(label) ? label : generateRandomColor();

    if (labelIndex !== undefined && labelIndex > -1) {
        myPieChart.data.datasets[0].data[labelIndex] = value;
        // Update color only if it's explicitly provided, indicating an edit action
        if (existingColor) {
            myPieChart.data.datasets[0].backgroundColor[labelIndex] = color;
        }
    } else {
        myPieChart.data.labels?.push(label);
        myPieChart.data.datasets[0].data.push(value);
        myPieChart.data.datasets[0].backgroundColor.push(color);
    }
    myPieChart.update();
    updateDataTable();
}

function updateDataTable() {
    dataTableBody.innerHTML = ''; // Clear existing rows
    myPieChart.data.labels?.forEach((label, index) => {
        const row = dataTableBody.insertRow();
        const labelCell = row.insertCell(0);
        const dataCell = row.insertCell(1);
        const actionsCell = row.insertCell(2);

        labelCell.innerHTML = `<input type="text" value="${label}" readonly />`;
        dataCell.innerHTML = `<input type="number" value="${myPieChart.data.datasets[0].data[index]}" readonly />`;

        // Create a new button element for editing
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        actionsCell.appendChild(editButton);

        // Directly attach the event listener to the button
        editButton.onclick = () => {
            const isReadOnly = labelCell.getElementsByTagName('input')[0].readOnly;
            labelCell.getElementsByTagName('input')[0].readOnly = !isReadOnly;
            dataCell.getElementsByTagName('input')[0].readOnly = !isReadOnly;

            if (!isReadOnly) {
                editButton.textContent = 'Save';
            } else {
                // Handle saving logic here
                const newLabel = labelCell.getElementsByTagName('input')[0].value;
                const newValue = parseFloat(dataCell.getElementsByTagName('input')[0].value);
                // Update the chart and table as needed
                editButton.textContent = 'Edit';
                // Ensure to recheck or adjust logic for handling label changes and uniqueness
            }
        };
    });
}


addDataBtn.addEventListener('click', () => {
    const label = labelInput.value.trim();
    const value = parseFloat(dataInput.value);
    if (label && !isNaN(value)) {
        updateOrAddChartData(label, value);
        labelInput.value = '';
        dataInput.value = '';
    } else {
        alert('Please enter both a label and a data value.');
    }
});

updateDataTable(); // Initialize the data table
