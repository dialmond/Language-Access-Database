const apiKey

 =

 'wenj70kpwim9i';
const spreadsheetId = 'wenj70kpwim9i'; // Replace with your spreadsheet ID
const sheetName = 'Data'; // Replace with your sheet name

fetch('https://sheetdb.io/api/v1/wenj70kpwim9i/values/${Data}?key=${wenj70kpwim9i}')
  .then(response => response.json())
  .then(data => console.log(data.values))
  .catch(error => console.error('Error:', error));

  import SheetDB from 'sheetdb-js'

  SheetDB.read('https://sheetdb.io/api/v1/wenj70kpwim9i', {}).then(function(result){
    console.log(result);
  }, function(error){
    console.log(error);
  });

  <script src="//sheetdb.io/api/js"></script>
<script>
SheetDB.read('https://sheetdb.io/api/v1/wenj70kpwim9i', {}).then(function(result){
  console.log(result);
}, function(error){
  console.log(error);
});
</script>