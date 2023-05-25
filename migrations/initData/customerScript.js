const fs = require('fs')
const { resolve } = require('path')
const xlsx = require('xlsx')

// Define the path to your CSV file
const migrationDataPath = resolve(__dirname, 'customer.xlsx')

function migrate() {
  const jsonData = []
  const workbook = xlsx.readFile(migrationDataPath)
  const worksheet = workbook.Sheets.customer
  const migrationData = xlsx.utils.sheet_to_json(worksheet)

  for (const item of migrationData) {
    jsonData.push({
      phoneCountryCode: '84',
      phoneNumber: item.phone.toString(),
      firstName: item.name,
      gender: 'FEMALE',
      address: item.address,
      createdAt: {
        $date: '2023-05-05T00:00:00.000Z'
      },
      updatedAt: {
        $date: '2023-05-05T00:00:00.000Z'
      },
      __v: 0
    })
  }
  fs.writeFile('customer.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing JSON file:', err)
    } else {
      console.log('JSON file has been successfully created!')
    }
  })
}

migrate()
