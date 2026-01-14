const fs = require('fs');

// Read the CSV file
fs.readFile('stock_legacy_full.csv', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    
    // Split the data into rows
    const rows = data.split('\n');
    
    // Get headers from the first row
    const headers = rows[0].split(',');

    // //sort data by alphabetical order of headers / date 
     headers.sort();
     Date.sort();


    // Parse the data
    const parsedData = [];
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim() === '') continue; // Skip empty rows
        
        const values = rows[i].split(',');
        const rowObject = {};
        
        headers.forEach((header, index) => {
            rowObject[header.trim()] = values[index] ? values[index].trim() : '';
        });
        
        parsedData.push(rowObject);
    }

// once sorted, put the cleaned code in the csv file called stock_legacy_clean.csv

    
    // Display the results
    console.log('Total rows:', parsedData.length);
    console.log('Headers:', headers);
    console.log('\nFirst 5 rows:');
    console.log(parsedData.slice(0, 5));
});
