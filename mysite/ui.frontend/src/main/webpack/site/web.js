// Stylesheets
//import "./main.scss";

import("app/prime");

//import("app/helloworld").then((module) => {
//  module.helloworld();  // Calls the imported function
//}).catch((error) => {
//  console.error("Error loading the module:", error);
//});



document.addEventListener('DOMContentLoaded', function() {
	//setTimeout(function() {
		import(
		/* webpackPreload: true */ 
		/* webpackFetchPriority: "high" */
		'app/data')
		  .then(({ getData, setData }) => {
			const updateDataButton = document.getElementById('updateData');
			const dataDisplay = document.getElementById('dataDisplay');
			// Initially display the data
			dataDisplay.textContent = `Current Data: ${getData()}`;

			// When the button is clicked, update the data
			updateDataButton.addEventListener('click', () => {
			  const newData = prompt('Enter new data:', getData());
			  if (newData !== null) {
				setData(newData); // Update the data
				dataDisplay.textContent = `Current Data: ${getData()}`; // Update display
			  }
			});
		  })
		  .catch(err => console.error('Error loading remote module:', err));
	//}, 5000); // 5 seconds
});

